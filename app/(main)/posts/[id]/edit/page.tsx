import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { updatePost } from "@/lib/actions/posts";

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
      title: "Edit Post",
      description: "Edit your DevConnect post.",
    };
  }

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: `Edit ${post.title}`,
    description: `Edit your DevConnect post: ${post.title}`,
  };
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

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

  return (
    <section className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      {/* Header */}
      <div className="reveal">
        <Link
          href={`/posts/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-400"
        >
          ← Back to post
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          Your post
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Edit your{" "}
          <span className="neon-gradient">post.</span>
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-gray-400">
          Update your post and keep the community up to date with your latest
          ideas.
        </p>
      </div>

      {/* Editor */}
      <div className="neon-card reveal reveal-delay-1 relative mt-10 overflow-hidden p-6 sm:p-8">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-[90px]" />

        <form
          action={updatePost.bind(null, id)}
          className="relative space-y-7"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Post title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={post.title}
              placeholder="What do you want to talk about?"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 transition duration-300 focus:border-cyan-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
            />
          </div>

          {/* Content */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-300"
              >
                Content
              </label>

              <span className="text-xs text-gray-600">
                Edit your content
              </span>
            </div>

            <textarea
              id="content"
              name="content"
              required
              rows={12}
              defaultValue={post.content}
              placeholder="Write your post here..."
              className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 leading-7 text-white outline-none placeholder:text-gray-600 transition duration-300 focus:border-violet-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_25px_rgba(139,92,246,0.08)]"
            />
          </div>

          {/* Information */}
          <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.03] p-4">
            <div className="flex gap-3">
              <span className="mt-0.5 text-violet-400">
                ✦
              </span>

              <div>
                <p className="text-sm font-medium text-gray-300">
                  Editing your post
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Your changes will be saved to the existing post. The original
                  author will remain unchanged.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
            <Link
              href={`/posts/${id}`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-medium text-gray-400 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="neon-button rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Save changes
              <span className="ml-2">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}