import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createPost } from "@/lib/actions/posts";
import SubmitButton from "@/components/SubmitButton";

export const metadata: Metadata = {
  title: "Create Post",
  description:
    "Create and share a new post with the DevConnect developer community.",
};

export default async function NewPostPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      {/* Header */}
      <div className="reveal">
        <Link
          href="/posts"
          className="text-sm text-gray-500 transition hover:text-cyan-400"
        >
          ← Back to posts
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Community
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Share something{" "}
          <span className="neon-gradient">useful.</span>
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-gray-400">
          Share an idea, technical experience, tutorial, project, or anything
          that could help another developer.
        </p>
      </div>

      {/* Editor */}
      <div className="neon-card reveal reveal-delay-1 relative mt-10 overflow-hidden p-6 sm:p-8">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-500/10 blur-[90px]" />

        <form action={createPost} className="relative space-y-7">
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
                Markdown-friendly
              </span>
            </div>

            <textarea
              id="content"
              name="content"
              required
              rows={12}
              placeholder="Write your post here..."
              className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 leading-7 text-white outline-none placeholder:text-gray-600 transition duration-300 focus:border-violet-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_25px_rgba(139,92,246,0.08)]"
            />
          </div>

          {/* Info */}
          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">
            <div className="flex gap-3">
              <span className="mt-0.5 text-cyan-400">✦</span>

              <div>
                <p className="text-sm font-medium text-gray-300">
                  Keep it useful
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Share something that other developers can learn from,
                  discuss, or build on.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/posts"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-medium text-gray-400 transition duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </Link>

            <SubmitButton className="neon-button rounded-xl px-6 py-3 text-sm font-semibold">
  Publish post
  <span className="ml-2">→</span>
</SubmitButton>
          </div>
        </form>
      </div>
    </section>
  );
}