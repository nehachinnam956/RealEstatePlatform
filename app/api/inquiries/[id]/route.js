import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const id = parseInt(params.id);

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ inquiry, messages: [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { status } = body;

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
      include: { property: true, user: true },
    });

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
