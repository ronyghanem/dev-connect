"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070812] px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[130px]" />

      <div className="relative w-full max-w-lg text-center">
        <div className="neon-card p-8 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/5 text-2xl text-red-400 shadow-[0_0_30px_rgba(248,113,113,0.1)]">
            !
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
            Something went wrong
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">
            We hit a problem.
          </h1>

          <p className="mt-4 leading-7 text-gray-500">
            Something unexpected happened while loading this page. You can
            try again or return to the homepage.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => reset()}
              className="neon-button rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Try again
            </button>

            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-gray-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}