import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

   if ( !email?.trim() || !password?.trim()) {
  return NextResponse.json(
    { error: "Name, email and password are required." },
    { status: 400 }
  );
}

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    const token = signSession({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
    });

    response.cookies.set("vault_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}