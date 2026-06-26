import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { normalizeKey } from "@/lib/tokens";

const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MINUTES = 5;

type LinkStatus =
  | "invalid"
  | "revoked"
  | "expired"
  | "used"
  | "locked_out"
  | "needs_password"
  | "public_ready";

function evaluateStatus(link: {
  isRevoked: boolean;
  isUsed: boolean;
  shareType: string;
  accessType: string;
  expiresAt: Date | null;
  lockedUntil: Date | null;
}): LinkStatus {
  if (link.isRevoked) return "revoked";
  if (link.shareType === "ONE_TIME" && link.isUsed) return "used";
  if (link.expiresAt && link.expiresAt < new Date()) return "expired";
  if (link.lockedUntil && link.lockedUntil > new Date()) return "locked_out";
  if (link.accessType === "PASSWORD") return "needs_password";
  return "public_ready";
}

// GET /api/share/[token] - check link status WITHOUT consuming it.
// This never increments view count or marks a one-time link used.
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const link = await prisma.shareLink.findUnique({
    where: { token: params.token },
    include: { note: { select: { title: true } } },
  });

  if (!link) {
    return NextResponse.json({ status: "invalid" satisfies LinkStatus }, { status: 404 });
  }

  const status = evaluateStatus(link);

  return NextResponse.json({
    status,
    title: link.note.title,
    shareType: link.shareType,
    accessType: link.accessType,
    viewCount: link.viewCount,
  });
}

// POST /api/share/[token] - attempt to VIEW/UNLOCK the note.
// body: { password?: string }
// This is the only path that increments view count or consumes a one-time link,
// and it does so atomically to remain correct under concurrent requests.
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { password } = await req.json().catch(() => ({ password: undefined }));

  const link = await prisma.shareLink.findUnique({ where: { token: params.token } });
  if (!link) {
    return NextResponse.json({ status: "invalid", error: "Link not found." }, { status: 404 });
  }

  const preStatus = evaluateStatus(link);

  if (preStatus === "revoked") {
    return NextResponse.json({ status: "revoked", error: "This link has been revoked." }, { status: 410 });
  }
  if (preStatus === "expired") {
    return NextResponse.json({ status: "expired", error: "This link has expired." }, { status: 410 });
  }
  if (preStatus === "used") {
    return NextResponse.json({ status: "used", error: "This one-time link has already been used." }, { status: 410 });
  }
  if (preStatus === "locked_out") {
    return NextResponse.json(
      { status: "locked_out", error: "Too many incorrect attempts. Try again later." },
      { status: 429 }
    );
  }

  // ---- Password check (does NOT touch view count / isUsed yet) ----
  if (link.accessType === "PASSWORD") {
    if (!password) {
      return NextResponse.json({ status: "needs_password", error: "Access key required." }, { status: 400 });
    }
    const valid = await verifyPassword(normalizeKey(password), link.passwordHash || "");

    if (!valid) {
      const attempts = link.failedAttempts + 1;
      const shouldLock = attempts >= LOCKOUT_THRESHOLD;

      await prisma.shareLink.update({
        where: { token: params.token },
        data: {
          failedAttempts: attempts,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : null,
        },
      });

      // Wrong password -> NO view count increase, by design.
      return NextResponse.json(
        {
          status: "wrong_password",
          error: shouldLock
            ? `Too many incorrect attempts. Locked for ${LOCKOUT_MINUTES} minutes.`
            : "Incorrect access key.",
          attemptsRemaining: Math.max(0, LOCKOUT_THRESHOLD - attempts),
        },
        { status: 401 }
      );
    }
  }

  // ---- Successful access: atomically claim the view ----
  // This single SQL statement is the entire race-condition fix.
  // Postgres serializes concurrent UPDATEs on the same row, so only one
  // concurrent request can ever flip isUsed false -> true and get a row back.
  let claimed: any[];

  if (link.shareType === "ONE_TIME") {
    claimed = await prisma.$queryRaw`
      UPDATE "ShareLink"
      SET "isUsed" = true,
          "viewCount" = "viewCount" + 1,
          "failedAttempts" = 0,
          "lockedUntil" = NULL
      WHERE token = ${params.token}
        AND "isUsed" = false
        AND "isRevoked" = false
        AND ("expiresAt" IS NULL OR "expiresAt" > now())
      RETURNING *;
    `;
  } else {
    claimed = await prisma.$queryRaw`
      UPDATE "ShareLink"
      SET "viewCount" = "viewCount" + 1,
          "failedAttempts" = 0,
          "lockedUntil" = NULL
      WHERE token = ${params.token}
        AND "isRevoked" = false
        AND ("expiresAt" IS NULL OR "expiresAt" > now())
      RETURNING *;
    `;
  }

  if (claimed.length === 0) {
    // Someone else (or a concurrent request) already consumed/revoked/expired it
    // between our pre-check above and this statement. Re-check to report why.
    const fresh = await prisma.shareLink.findUnique({ where: { token: params.token } });
    const finalStatus = fresh ? evaluateStatus(fresh) : "invalid";
    return NextResponse.json(
      { status: finalStatus, error: "This link is no longer available." },
      { status: 410 }
    );
  }

  const note = await prisma.note.findUnique({ where: { id: link.noteId } });

  return NextResponse.json({
    status: "unlocked",
    title: note?.title,
    content: note?.content,
    viewCount: claimed[0].viewCount,
  });
}
