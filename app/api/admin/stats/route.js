// app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [totalProperties, available, sold, totalUsers, inquiries, recentProperties] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "available" } }),
      prisma.property.count({ where: { status: "sold" } }),
      prisma.user.count(),
      prisma.inquiry.count(),
      prisma.property.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    const totalValue = await prisma.property.aggregate({ _sum: { price: true } });
    return NextResponse.json({ totalProperties, available, sold, totalUsers, inquiries, totalValue: totalValue._sum.price || 0, recentProperties });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
