import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Developer from "@/models/Developer";
import { requireAdmin } from "@/lib/isAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid developer ID." },
        { status: 400 }
      );
    }

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

    const developer = await Developer.findByIdAndUpdate(
      id,
      {
        name,
        role,
        bio,
        image,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(developer, {
      status: 200,
    });
  } catch (error) {
    console.error("PUT /api/developers/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update developer." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 }
    );
  }
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid developer ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const developer = await Developer.findByIdAndDelete(id);

    if (!developer) {
      return NextResponse.json(
        { error: "Developer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Developer deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE /api/developers/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to delete developer." },
      { status: 500 }
    );
  }
}