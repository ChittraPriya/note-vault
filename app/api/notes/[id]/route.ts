import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const note = await prisma.note.findUnique({
    where: { id: params.id },
    include: { shareLinks: { orderBy: { createdAt: "desc" } } },
  });

  if (!note || note.userId !== session.userId) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  // strip password hashes before sending to client
  const sanitized = {
    ...note,
    shareLinks: note.shareLinks.map((l) => ({ ...l, passwordHash: undefined })),
  };

  return NextResponse.json(sanitized);
}
