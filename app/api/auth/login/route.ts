import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
  where: { email },
});

console.log("User found:", !!user);

if (!user) {
  return NextResponse.json(
    { error: "Invalid email or password." },
    { status: 401 }
  );
}

    const valid = await verifyPassword(password, user.password);
    console.log("Password valid:", valid);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signSession({ userId: user.id, email: user.email });
     await setSessionCookie(token);

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
