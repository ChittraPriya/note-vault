import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { generateShareToken, generateAccessKey } from "@/lib/tokens";
import { hashPassword } from "@/lib/auth";

// GET /api/notes - list current user's notes
export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const notes = await prisma.note.findMany({
    where: { userId: session.userId },
    include: { shareLinks: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

// POST /api/notes - create note + its share link in one step
export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const { title, content, expiresAt, shareType, accessType } = await req.json();

    if (!title || !content || !shareType || !accessType) {
      return NextResponse.json({ error: "Title, content, share type, and access type are required." }, { status: 400 });
    }
    if (!["ONE_TIME", "TIME_BASED"].includes(shareType)) {
      return NextResponse.json({ error: "Invalid share type." }, { status: 400 });
    }
    if (!["PUBLIC", "PASSWORD"].includes(accessType)) {
      return NextResponse.json({ error: "Invalid access type." }, { status: 400 });
    }
    if (shareType === "TIME_BASED" && !expiresAt) {
      return NextResponse.json({ error: "Time-based links require an expiry date." }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: { title, content, userId: session.userId },
    });

    const token = generateShareToken();
    let rawAccessKey: string | null = null;
    let passwordHash: string | null = null;

    if (accessType === "PASSWORD") {
      rawAccessKey = generateAccessKey();
      passwordHash = await hashPassword(rawAccessKey);
    }

    const shareLink = await prisma.shareLink.create({
      data: {
        token,
        noteId: note.id,
        shareType,
        accessType,
        passwordHash,
        expiresAt: shareType === "TIME_BASED" ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      note,
      shareLink: { ...shareLink, passwordHash: undefined },
      // Returned exactly once. The server never exposes this again after this response.
      accessKey: rawAccessKey,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create note." }, { status: 500 });
  }
}
