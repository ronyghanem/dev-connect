import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/auth";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to DevConnect with GitHub and join the developer community.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070812] px-6 py-12">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />

        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[120px]" />

        <div className="absolute -right-32 top-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="reveal flex justify-center">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.15)] transition duration-300 group-hover:scale-105 group-hover:border-cyan-300/80 group-hover:shadow-[0_0_35px_rgba(34,211,238,0.3)]">
              <span className="text-xl font-bold text-cyan-300">
               <Image
  src="/icon.png"
  alt="DevConnect"
  width={56}
  height={56}
  className="h-full w-full object-cover"
 />
              </span>
            </div>

            <span className="text-2xl font-bold">
              <span className="neon-gradient">DevConnect</span>
            </span>
          </Link>
        </div>

        <div className="neon-card reveal reveal-delay-1 relative mt-8 overflow-hidden p-7 sm:p-9">
          {/* Card glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-[90px]" />

          <div className="relative text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/5 text-2xl text-violet-300 shadow-[0_0_25px_rgba(139,92,246,0.1)]">
              ✦
            </div>

            <h1 className="mt-6 text-3xl font-bold text-white">
              Welcome back
            </h1>

            <p className="mt-3 leading-6 text-gray-400">
              Sign in to continue building and connecting with the developer
              community.
            </p>
          </div>

          {/* GitHub */}
          <form
            action={async () => {
              "use server";

              await signIn("github", {
                redirectTo: "/",
              });
            }}
            className="relative mt-8"
          >
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
            >
              {/* GitHub icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current text-gray-300 transition group-hover:text-white"
                aria-hidden="true"
              >
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
              </svg>

              Continue with GitHub

              <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-cyan-400">
                →
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7 flex items-center">
            <div className="h-px flex-1 bg-white/5" />

            <span className="px-4 text-xs uppercase tracking-widest text-gray-600">
              Secure sign in
            </span>

            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Security message */}
          <div className="rounded-xl border border-lime-400/10 bg-lime-400/[0.03] p-4">
            <div className="flex gap-3">
              <span className="text-lime-400">✓</span>

              <div>
                <p className="text-sm font-medium text-gray-300">
                  Authentication powered by GitHub
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-600">
                  Your GitHub account is used to securely authenticate your
                  DevConnect account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="reveal reveal-delay-2 mt-6 text-center text-xs text-gray-600">
          By continuing, you agree to use DevConnect responsibly and respect
          the developer community.
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 transition hover:text-cyan-400"
          >
            ← Return to DevConnect
          </Link>
        </div>
      </div>
    </main>
  );
}