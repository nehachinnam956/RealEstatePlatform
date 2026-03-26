// app/api/inquiries/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Please login to send inquiry" }, { status: 401 });
    const { message, propertyId } = await request.json();
    if (!message || !propertyId) return NextResponse.json({ error: "Message and propertyId required" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const inquiry = await prisma.inquiry.create({
      data: { message, propertyId: parseInt(propertyId), userId: user.id, status: "pending" },
      include: { property: { select: { title: true } }, user: { select: { name: true } } },
    });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const agentId = searchParams.get("agentId");

    const where = {};

    if (userId) {
      where.userId = parseInt(userId);
    }

    if (agentId) {
      where.property = {
        agentId: parseInt(agentId),
      };
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        property: { select: { id: true, title: true, city: true, location: true, agent: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries, total: inquiries.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
