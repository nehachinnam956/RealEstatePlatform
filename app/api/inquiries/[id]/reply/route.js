import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Verify user has access to this inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { property: true, user: true },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Check if user is agent or inquiry sender
    const isAgent = inquiry.property.agentId === session.user.id || session.user.role === "admin";
    const isInitiator = inquiry.userId === session.user.id;

    if (!isAgent && !isInitiator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update inquiry status if first agent reply
    if (isAgent && inquiry.status === "pending") {
      await prisma.inquiry.update({
        where: { id },
        data: { status: "contacted" },
      });
    }

    // For now, we'll create a simple structured message
    // In a full implementation, you'd have a Messages table
    const createdInquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        // Store the message in the inquiry itself
        message: `${inquiry.message}\n\n---\n[${new Date().toLocaleString()}] ${session.user.name}: ${message}`,
      },
      include: { property: true, user: true },
    });

    return NextResponse.json({
      message: {
        id: `reply-${Date.now()}`,
        content: message,
        sender: { id: session.user.id, name: session.user.name },
        senderId: session.user.id,
        createdAt: new Date(),
      },
      inquiry: createdInquiry,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
