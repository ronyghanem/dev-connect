"use server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be logged in to create a post.");
  }

  const title = formData.get("title")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim() || "";

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email,
  });

  if (!user) {
    throw new Error("User profile not found.");
  }

  const post = await Post.create({
    title,
    content,
    author: user._id,
    authorName: user.name,
  });

  revalidatePath("/posts");

  redirect(`/posts/${post._id}`);
}

export async function updatePost(
  postId: string,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be logged in.");
  }

  const title = formData.get("title")?.toString().trim() || "";
  const content = formData.get("content")?.toString().trim() || "";

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email,
  });

  if (!user) {
    throw new Error("User profile not found.");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.author.toString() !== user._id.toString()) {
    throw new Error("You can only edit your own posts.");
  }

  await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        title,
        content,
      },
    },
    {
      returnDocument: "after",
    }
  );

  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);

  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be logged in.");
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email,
  });

  if (!user) {
    throw new Error("User profile not found.");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found.");
  }

  if (post.author.toString() !== user._id.toString()) {
    throw new Error("You can only delete your own posts.");
  }

  await Post.findByIdAndDelete(postId);

  revalidatePath("/posts");

  redirect("/posts");
}