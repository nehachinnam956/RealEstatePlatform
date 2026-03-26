// app/api/properties/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(_, { params }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(params.id) },
      include: { inquiries: { include: { user: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } } },
    });
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(property);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const property = await prisma.property.update({
      where: { id: parseInt(params.id) },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        beds:  body.beds  ? parseInt(body.beds)    : undefined,
        baths: body.baths ? parseInt(body.baths)   : undefined,
        area:  body.area  ? parseFloat(body.area)  : undefined,
      },
    });
    return NextResponse.json(property);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await prisma.property.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
