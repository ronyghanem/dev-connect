import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { updateProfile } from "@/lib/actions/profile";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your developer profile, skills, bio, and GitHub information on DevConnect.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  await connectDB();

  const user = await User.findOne({
    email: session.user.email,
  }).lean();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-14 sm:py-20">
      {/* Header */}
      <div className="reveal">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Account
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Your developer{" "}
          <span className="neon-gradient">profile.</span>
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-gray-400">
          Keep your profile up to date so other developers can learn more about
          you and what you build.
        </p>
      </div>

      {/* Profile editor */}
      <div className="neon-card reveal reveal-delay-1 relative mt-10 overflow-hidden p-6 sm:p-10">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-violet-500/10 blur-[110px]" />

        <div className="relative">
          {/* Profile preview */}
          <div className="flex flex-col gap-6 border-b border-white/5 pb-8 sm:flex-row sm:items-center">
            <div className="relative mx-auto sm:mx-0">
              {/* Glow */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 opacity-40 blur-lg" />

              {/* Profile image */}
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-cyan-300/40 bg-gradient-to-br from-cyan-400/15 to-violet-500/15 text-3xl font-bold text-cyan-300">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Developer"}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase() || "D"
                )}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-white">
                {user.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {user.githubUsername
                  ? `@${user.githubUsername}`
                  : "Developer"}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/5 px-3 py-1 text-xs text-lime-300">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]" />
                Profile active
              </div>
            </div>
          </div>

          {/* Form */}
          <form action={updateProfile} className="mt-8 space-y-7">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Display name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={user.name}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 transition duration-300 focus:border-cyan-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-gray-600"
              />

              <p className="mt-2 text-xs text-gray-600">
                Your email comes from your GitHub account and cannot be changed
                here.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                rows={5}
                defaultValue={user.bio || ""}
                placeholder="Tell the community a little about yourself..."
                className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 leading-7 text-white outline-none placeholder:text-gray-600 transition duration-300 focus:border-violet-400/60 focus:bg-white/[0.06] focus:shadow-[0_0_25px_rgba(139,92,246,0.08)]"
              />
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="skills"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Skills
              </label>

              <input
                id="skills"
                name="skills"
                type="text"
                defaultValue={user.skills?.join(", ") || ""}
                placeholder="React, Next.js, Node.js, MongoDB"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 transition duration-300 focus:border-lime-400/50 focus:bg-white/[0.06] focus:shadow-[0_0_25px_rgba(163,230,53,0.08)]"
              />

              <p className="mt-2 text-xs text-gray-600">
                Separate your skills with commas.
              </p>

              {user.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="neon-skill rounded-lg px-3 py-1.5 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub */}
            <div>
              <label
                htmlFor="githubUsername"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                GitHub username
              </label>

              <div className="flex">
                <span className="flex items-center rounded-l-xl border border-r-0 border-white/10 bg-white/[0.02] px-4 text-gray-600">
                  @
                </span>

                <input
                  id="githubUsername"
                  name="githubUsername"
                  type="text"
                  defaultValue={user.githubUsername || ""}
                  placeholder="username"
                  className="min-w-0 flex-1 rounded-r-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 transition duration-300 focus:border-cyan-400/60 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end border-t border-white/5 pt-7">
              <button
                type="submit"
                className="neon-button rounded-xl px-7 py-3 text-sm font-semibold"
              >
                Save profile
                <span className="ml-2">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}