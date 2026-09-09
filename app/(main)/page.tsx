import type { Metadata } from "next";
import Link from "next/link";
import LatestPosts from "@/components/LatestPosts";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to DevConnect, a community platform for developers to connect, build, and share.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:pt-32">
        <div className="max-w-4xl">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]" />
            Developer Community
          </div>

          <h1 className="reveal reveal-delay-1 mt-7 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-8xl">
            Connect.
            <br />
            <span className="neon-gradient">Build. Share.</span>
          </h1>

          <p className="reveal reveal-delay-2 mt-7 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl">
            A place where developers showcase their work, share knowledge,
            publish ideas, and connect with people building the future.
          </p>

          <div className="reveal reveal-delay-3 mt-9 flex flex-wrap gap-4">
            <Link
              href="/developers"
              className="neon-button rounded-2xl px-6 py-3.5 font-semibold"
            >
              Explore Developers
            </Link>

            <Link
              href="/posts"
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-gray-200 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/10 hover:text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
            >
              Browse Posts
            </Link>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="pointer-events-none absolute right-0 top-20 hidden h-96 w-96 rounded-full bg-violet-600/10 blur-[120px] lg:block" />

        <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px] md:block" />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 reveal">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Why DevConnect
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Built for developers
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            number="01"
            title="Developer Profiles"
            description="Create a personal developer profile and showcase your skills, experience, and projects."
            accent="cyan"
          />

          <FeatureCard
            number="02"
            title="Community Posts"
            description="Share technical knowledge, ideas, experiences, and useful resources with the community."
            accent="violet"
          />

          <FeatureCard
            number="03"
            title="Connect"
            description="Discover developers, explore their work, and learn from people building interesting things."
            accent="lime"
          />
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="reveal">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
              Community
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Latest <span className="neon-gradient">posts</span>
            </h2>

            <p className="mt-3 text-gray-400">
              See what developers in the community are talking about.
            </p>
          </div>

          <Link
            href="/posts"
            className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            View all →
          </Link>
        </div>

        <LatestPosts />
      </section>
    </>
  );
}

function FeatureCard({
  number,
  title,
  description,
  accent,
}: {
  number: string;
  title: string;
  description: string;
  accent: "cyan" | "violet" | "lime";
}) {
  const accentStyles = {
    cyan: {
      number: "text-cyan-400",
      glow: "group-hover:shadow-[0_0_35px_rgba(34,211,238,0.12)]",
      border: "group-hover:border-cyan-400/30",
    },
    violet: {
      number: "text-violet-400",
      glow: "group-hover:shadow-[0_0_35px_rgba(139,92,246,0.15)]",
      border: "group-hover:border-violet-400/30",
    },
    lime: {
      number: "text-lime-400",
      glow: "group-hover:shadow-[0_0_35px_rgba(163,230,53,0.12)]",
      border: "group-hover:border-lime-400/30",
    },
  };

  const style = accentStyles[accent];

  return (
    <div
      className={`neon-card group reveal p-7 ${style.glow} ${style.border}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${style.number}`}>
          {number}
        </span>

        <span className="text-xl text-gray-600 transition duration-300 group-hover:scale-125 group-hover:text-gray-300">
          ✦
        </span>
      </div>

      <h3 className="mt-8 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-400">
        {description}
      </p>
    </div>
  );
}