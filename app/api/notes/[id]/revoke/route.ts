import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

// POST /api/notes/[id]/revoke  body: { shareLinkId: string }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { shareLinkId } = await req.json();
  if (!shareLinkId) return NextResponse.json({ error: "shareLinkId is required." }, { status: 400 });

  // Ownership check: the note must belong to this user
  const note = await prisma.note.findUnique({ where: { id: params.id } });
  if (!note || note.userId !== session.userId) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const link = await prisma.shareLink.findUnique({ where: { id: shareLinkId } });
  if (!link || link.noteId !== note.id) {
    return NextResponse.json({ error: "Share link not found." }, { status: 404 });
  }

  const updated = await prisma.shareLink.update({
    where: { id: shareLinkId },
    data: { isRevoked: true },
  });

  return NextResponse.json({ ...updated, passwordHash: undefined });
}
