// app/api/properties/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city     = searchParams.get("city");
    const type     = searchParams.get("type");
    const listing  = searchParams.get("listing");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search   = searchParams.get("search");
    const featured = searchParams.get("featured");
    const status   = searchParams.get("status");
    const page     = parseInt(searchParams.get("page") || "1");
    const limit    = parseInt(searchParams.get("limit") || "12");
    const sortBy   = searchParams.get("sortBy") || "createdAt";
    const sortOrder= searchParams.get("sortOrder") || "desc";

    const where = {
      ...(city    && { city: { contains: city, mode: "insensitive" } }),
      ...(type    && { type: { contains: type, mode: "insensitive" } }),
      ...(listing && { listing }),
      ...(status  && { status }),
      ...(featured && { featured: featured === "true" }),
      ...(search  && { OR: [
        { title:    { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { city:     { contains: search, mode: "insensitive" } },
        { type:     { contains: search, mode: "insensitive" } },
      ]}),
      ...((minPrice || maxPrice) && { price: {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      }}),
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({ properties, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user?.role !== "agent" && session.user?.role !== "admin")) {
      return NextResponse.json({ error: "Only agents and admins can post properties" }, { status: 403 });
    }
    
    const body = await request.json();
    const { title, city, location, price, type, listing, beds, baths, area, status, imageUrl, images, description, amenities, agentId } = body;
    
    if (!title || !city || !location || !price || !area) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        title,
        city,
        location,
        price: parseFloat(price),
        type: type || "Residential",
        listing: listing || "Buy",
        beds: parseInt(beds) || 0,
        baths: parseInt(baths) || 0,
        area: parseFloat(area),
        status: status || "available",
        imageUrl: imageUrl || null,
        images: images || [],
        amenities: amenities || [],
        description: description || null,
        agentId: agentId ? parseInt(agentId) : parseInt(session.user.id),
      },
    });
    
    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
