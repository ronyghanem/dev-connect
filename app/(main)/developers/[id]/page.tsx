import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  await connectDB();

  let user;

  try {
    user = await User.findById(id).lean();
  } catch {
    return {
      title: "Developer Not Found",
      description: "The requested developer profile could not be found.",
    };
  }

  if (!user) {
    return {
      title: "Developer Not Found",
      description: "The requested developer profile could not be found.",
    };
  }

  return {
    title: user.name,
    description:
      user.bio ||
      `View ${user.name}'s developer profile, skills, and experience on DevConnect.`,
  };
}

export default async function DeveloperPage({ params }: Props) {
  const { id } = await params;

  await connectDB();

  let user;

  try {
    user = await User.findById(id).lean();
  } catch {
    notFound();
  }

  if (!user) {
    notFound();
  }

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-12 sm:py-20">
      {/* Back */}
      <div className="reveal">
        <Link
          href="/developers"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-cyan-400"
        >
          <span className="transition group-hover:-translate-x-1">←</span>
          Back to developers
        </Link>
      </div>

      {/* Main profile card */}
      <div className="neon-card reveal reveal-delay-1 relative mt-8 overflow-hidden p-6 sm:p-10">
        {/* Top glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative">
          {/* Profile header */}
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative mx-auto sm:mx-0">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-50 blur-lg" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-300/40 bg-gradient-to-br from-cyan-400/15 via-violet-500/15 to-fuchsia-500/15 text-4xl font-bold text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.2)]">
                {user.name?.charAt(0).toUpperCase() || "D"}
              </div>
            </div>

            {/* Name */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {user.name}
                </h1>

                <span className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/5 px-3 py-1 text-xs font-medium text-lime-300 sm:mx-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]" />
                  Community member
                </span>
              </div>

              {user.githubUsername && (
                <p className="mt-2 text-gray-500">
                  @{user.githubUsername}
                </p>
              )}

              <p className="mt-5 max-w-2xl text-gray-400">
                {user.bio || "This developer hasn't added a bio yet."}
              </p>

              {user.githubUsername && (
                <a
                  href={`https://github.com/${user.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neon-button mt-6 inline-flex rounded-xl px-5 py-2.5 text-sm font-medium"
                >
                  View GitHub
                  <span className="ml-2">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Skills */}
          <div className="reveal reveal-delay-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Expertise
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  Skills & technologies
                </h2>
              </div>

              <span className="text-sm text-gray-600">
                {user.skills?.length || 0} skills
              </span>
            </div>

            {user.skills?.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {user.skills.map((skill: string, index: number) => (
                  <span
                    key={skill}
                    className="neon-skill reveal rounded-xl px-4 py-2 text-sm font-medium"
                    style={{
                      animationDelay: `${index * 70}ms`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                <p className="text-sm text-gray-500">
                  No skills added yet.
                </p>
              </div>
            )}
          </div>

          {/* Profile details */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Member since
              </p>

              <p className="mt-2 font-medium text-gray-200">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Profile status
              </p>

              <p className="mt-2 flex items-center gap-2 font-medium text-gray-200">
                <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
                Active developer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}