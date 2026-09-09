import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Developer from "@/models/Developer";
import { requireAdmin } from "@/lib/isAdmin";

export async function GET() {
  try {
    await connectDB();

    const developers = await Developer.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(developers, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/developers error:", error);

    return NextResponse.json(
      { error: "Failed to fetch developers." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }

  try {
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const name = body.name?.toString().trim() || "";
    const role = body.role?.toString().trim() || "";
    const bio = body.bio?.toString().trim() || "";
    const image = body.image?.toString().trim() || "";

    if (!name || !role || !bio) {
      return NextResponse.json(
        { error: "Name, role, and bio are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const developer = await Developer.create({
      name,
      role,
      bio,
      image,
    });

    return NextResponse.json(developer, { status: 201 });
  } catch (error) {
    console.error("POST /api/developers error:", error);

    return NextResponse.json(
      { error: "Failed to create developer." },
      { status: 500 }
    );
  }
}