import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Discover developers, explore their skills, and connect with the DevConnect community.",
};

export default async function DevelopersPage() {
  await connectDB();

  const users = await User.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      {/* Header */}
      <div className="reveal max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Community
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Meet the{" "}
          <span className="neon-gradient">developers.</span>
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-400">
          Explore developers in the community, discover their skills, and see
          what they are building.
        </p>
      </div>

      {/* Developer count */}
      <div className="reveal reveal-delay-1 mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.9)]" />

        <span className="text-sm text-gray-300">
          {users.length} {users.length === 1 ? "developer" : "developers"}{" "}
          in the community
        </span>
      </div>

      {/* Developers */}
      {users.length === 0 ? (
        <div className="neon-card mt-10 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5 text-2xl text-cyan-400">
            ✦
          </div>

          <h2 className="mt-5 text-xl font-semibold text-white">
            No developers yet
          </h2>

          <p className="mt-2 text-gray-400">
            Be the first developer to join the community.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user, index) => (
            <Link
              key={user._id.toString()}
              href={`/developers/${user._id}`}
              className={`neon-card group reveal reveal-delay-${Math.min(
                index + 1,
                4
              )} p-6`}
            >
              {/* Avatar */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-40 blur-md transition duration-300 group-hover:opacity-80" />

                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-xl font-bold text-cyan-300">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Developer"}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || "D"
                    )}
                  </div>
                </div>

                <span className="text-gray-600 transition duration-300 group-hover:translate-x-1 group-hover:text-cyan-400">
                  →
                </span>
              </div>

              {/* Info */}
              <h2 className="mt-6 text-xl font-semibold text-white transition duration-300 group-hover:text-cyan-300">
                {user.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {user.githubUsername
                  ? `@${user.githubUsername}`
                  : "Developer"}
              </p>

              <p className="mt-4 line-clamp-3 min-h-[72px] leading-6 text-gray-400">
                {user.bio || "No bio added yet."}
              </p>

              {/* Skills */}
              {user.skills?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {user.skills.slice(0, 4).map((skill: string) => (
                    <span
                      key={skill}
                      className="neon-skill rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}

                  {user.skills.length > 4 && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-500">
                      +{user.skills.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 border-t border-white/5 pt-4">
                <span className="text-sm font-medium text-gray-500 transition group-hover:text-cyan-400">
                  View profile
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}