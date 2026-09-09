import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { requireAdmin } from "@/lib/isAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid post ID." },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findById(id).lean();

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(post, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to fetch post." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { isAdmin } = await requireAdmin();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid post ID." },
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

    const title = body.title?.toString().trim();
    const content = body.content?.toString().trim();

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

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    // Admin can edit any post.
    // Regular developers can only edit their own posts.
    const isOwner =
      post.author.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You can only edit your own posts." },
        { status: 403 }
      );
    }

    post.title = title;
    post.content = content;

    await post.save();

    return NextResponse.json(post, {
      status: 200,
    });
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { isAdmin } = await requireAdmin();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid post ID." },
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

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    // Admin can delete any post.
    // Regular developers can only delete their own posts.
    const isOwner =
      post.author.toString() === user._id.toString();

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "You can only delete your own posts." },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Post deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to delete post." },
      { status: 500 }
    );
  }
}