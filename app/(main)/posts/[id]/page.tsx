import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { deletePost } from "@/lib/actions/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  await connectDB();

  let post;

  try {
    post = await Post.findById(id).lean();
  } catch {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160),
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  await connectDB();

  let post;

  try {
    post = await Post.findById(id).lean();
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const session = await auth();

  let isOwner = false;

  if (session?.user?.email) {
    const currentUser = await User.findOne({
      email: session.user.email,
    }).lean();

    if (currentUser) {
      isOwner =
        post.author.toString() === currentUser._id.toString();
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      {/* Back */}
      <div className="reveal">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-400"
        >
          ← Back to posts
        </Link>
      </div>

      {/* Article */}
      <article className="neon-card reveal reveal-delay-1 relative mt-8 overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet-500/10 blur-[110px]" />

        <div className="relative p-6 sm:p-10">
          {/* Category */}
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300">
              Community post
            </span>

            <span className="text-xs text-gray-600">
              {new Date(post.createdAt).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>

          {/* Author */}
          <div className="mt-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-gradient-to-br from-cyan-400/15 to-violet-500/15 font-semibold text-cyan-300">
              {post.authorName?.charAt(0).toUpperCase() || "D"}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-200">
                {post.authorName}
              </p>

              <p className="text-xs text-gray-600">
                Developer community member
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Content */}
          <div className="whitespace-pre-wrap text-[16px] leading-8 text-gray-300 sm:text-lg">
            {post.content}
          </div>

          {/* Owner controls */}
          {isOwner && (
            <>
              <div className="my-8 h-px bg-white/5" />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Manage your post
                  </p>

                  <p className="mt-1 text-xs text-gray-600">
                    You can edit or remove this post.
                  </p>
                </div>

                <div className="flex gap-3">
                  {/* Edit */}
                  <Link
                    href={`/posts/${post._id}/edit`}
                    className="rounded-xl border border-violet-400/20 bg-violet-400/5 px-5 py-2.5 text-sm font-medium text-violet-300 transition duration-300 hover:border-violet-400/50 hover:bg-violet-400/10 hover:shadow-[0_0_25px_rgba(139,92,246,0.12)]"
                  >
                    Edit
                  </Link>

                  {/* Delete */}
                  <form
                    action={deletePost.bind(
                      null,
                      post._id.toString()
                    )}
                  >
                    <button
                      type="submit"
                      className="rounded-xl border border-red-400/20 bg-red-400/5 px-5 py-2.5 text-sm font-medium text-red-400 transition duration-300 hover:border-red-400/50 hover:bg-red-400/10 hover:shadow-[0_0_25px_rgba(248,113,113,0.12)]"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </article>

      {/* Footer */}
      <div className="reveal reveal-delay-2 mt-8 text-center">
        <Link
          href="/posts"
          className="text-sm text-gray-500 transition hover:text-cyan-400"
        >
          Explore more posts →
        </Link>
      </div>
    </section>
  );
}