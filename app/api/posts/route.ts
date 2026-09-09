import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(posts, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);

    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = body.title?.toString().trim() || "";
    const content = body.content?.toString().trim() || "";

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    const post = await Post.create({
      title,
      content,
      author: user._id,
      authorName: user.name,
    });

    return NextResponse.json(post, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/posts error:", error);

    return NextResponse.json(
      { error: "Failed to create post." },
      { status: 500 }
    );
  }
}