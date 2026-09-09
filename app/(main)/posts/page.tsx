import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import PostActions from "./PostActions";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "Explore technical posts, ideas, experiences, and resources shared by developers on DevConnect.",
};

export default async function PostsPage() {
  const session = await auth();

  const sessionEmail = session?.user?.email?.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  const isAdmin =
    !!sessionEmail &&
    !!adminEmail &&
    sessionEmail === adminEmail;

  await connectDB();

  const posts = await Post.find()
    .populate({
      path: "author",
      select: "name image githubUsername email",
    })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
        <div className="reveal max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
            Community
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Developer{" "}
            <span className="neon-gradient">posts.</span>
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-400">
            Discover ideas, technical knowledge, experiences, and resources
            shared by developers in the community.
          </p>
        </div>

        <Link
          href="/posts/new"
          className="neon-button reveal reveal-delay-1 inline-flex w-fit rounded-xl px-5 py-3 text-sm font-semibold"
        >
          + Create post
        </Link>
      </div>

      {/* Stats */}
      <div className="reveal reveal-delay-1 mt-10 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />

        <span className="text-sm text-gray-300">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in the
          community
        </span>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="neon-card reveal reveal-delay-2 mt-10 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-2xl text-cyan-400">
            ✦
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-white">
            No posts yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-400">
            Be the first developer to share something with the community.
          </p>

          <Link
            href="/posts/new"
            className="neon-button mt-7 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Create the first post
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const author = post.author as {
              _id: string;
              name?: string;
              image?: string;
              githubUsername?: string;
              email?: string;
            } | null;

            const authorName =
              author?.name || post.authorName || "Developer";

            const authorImage = author?.image || "";

            const isOwner =
              !!session?.user?.email &&
              !!author?.email &&
              session.user.email.toLowerCase() ===
                author.email.toLowerCase();

            const canManage = isAdmin || isOwner;

            return (
              <article
                key={post._id.toString()}
                className={`neon-card group reveal reveal-delay-${Math.min(
                  index + 1,
                  4
                )} flex h-full flex-col p-6`}
              >
                {/* Top */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-300">
                    Community
                  </span>

                  <Link
                    href={`/posts/${post._id}`}
                    className="text-gray-600 transition duration-300 hover:translate-x-1 hover:text-cyan-400"
                    aria-label={`View ${post.title}`}
                  >
                    →
                  </Link>
                </div>

                {/* Title */}
                <Link href={`/posts/${post._id}`}>
                  <h2 className="mt-6 line-clamp-2 text-xl font-semibold leading-7 text-white transition duration-300 group-hover:text-cyan-300">
                    {post.title}
                  </h2>
                </Link>

                {/* Content */}
                <Link
                  href={`/posts/${post._id}`}
                  className="flex-1"
                >
                  <p className="mt-3 line-clamp-4 leading-7 text-gray-400">
                    {post.content}
                  </p>
                </Link>

                {/* Footer */}
                <div className="mt-7 border-t border-white/5 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    {/* Author */}
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Profile photo */}
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-400/15 to-violet-500/15">
                        {authorImage ? (
                          <Image
                            src={authorImage}
                            alt={authorName}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-cyan-300">
                            {authorName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Author info */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-300">
                          {authorName}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Post icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/5 text-sm text-violet-300 transition duration-300 group-hover:border-violet-400/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                      ✦
                    </div>
                  </div>

                  {/* Edit / Delete */}
                  {canManage && (
                    <PostActions postId={post._id.toString()} />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}