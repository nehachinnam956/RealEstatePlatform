// app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const hashed = await bcrypt.hash(password, 10);
    const normalizedEmail = email.trim().toLowerCase();
    const inferredRole = role || (normalizedEmail.endsWith("@realty.com") ? "agent" : "buyer");
    const user = await prisma.user.create({
      data: { name, email: normalizedEmail, password: hashed, role: inferredRole },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
