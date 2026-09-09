import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070812] px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[130px]" />

      <div className="relative text-center">
        <div className="reveal">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            DevConnect
          </p>

          <h1 className="neon-gradient mt-5 text-8xl font-black tracking-tight sm:text-9xl">
            404
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            Page not found
          </h2>

          <p className="mx-auto mt-4 max-w-md leading-7 text-gray-500">
            Looks like this page doesn't exist, or it may have moved somewhere
            else.
          </p>

          <Link
            href="/"
            className="neon-button mt-8 inline-flex rounded-xl px-6 py-3 text-sm font-semibold"
          >
            ← Back home
          </Link>
        </div>
      </div>
    </main>
  );
}