"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
};

export default function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts");

        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();
        setPosts(data.slice(0, 3));
      } catch (error) {
        console.error(error);
        setError("Could not load posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="neon-card animate-pulse p-7">
        <div className="h-5 w-1/3 rounded bg-white/10" />
        <div className="mt-4 h-4 w-full rounded bg-white/5" />
        <div className="mt-2 h-4 w-2/3 rounded bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="neon-card p-7">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="neon-card p-7">
        <p className="text-gray-400">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {posts.map((post, index) => (
        <Link
          href={`/posts/${post._id}`}
          key={post._id}
          className={`neon-card group reveal reveal-delay-${index + 1} block p-6`}
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300">
              Community
            </span>

            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-cyan-400">
              →
            </span>
          </div>

          <h3 className="line-clamp-2 text-xl font-semibold text-white transition group-hover:text-cyan-300">
            {post.title}
          </h3>

          <p className="mt-3 line-clamp-3 leading-6 text-gray-400">
            {post.content}
          </p>

          <div className="mt-6 border-t border-white/5 pt-4">
            <p className="text-sm text-gray-500">
              By{" "}
              <span className="text-gray-300">
                {post.authorName}
              </span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}