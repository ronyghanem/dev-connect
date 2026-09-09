import Link from "next/link";
import { auth, signOut } from "@/auth";
import NavLinks from "./NavLinks";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();

  const userName = session?.user?.name || "Developer";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session?.user?.image || "";

  const isAdmin =
    session?.user?.email?.toLowerCase() ===
    process.env.ADMIN_EMAIL?.toLowerCase();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070812]/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-cyan-400/20 blur-md opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.15)] transition duration-300 group-hover:scale-105 group-hover:border-cyan-300/80 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <Image
                src="/icon.png"
                alt="DevConnect"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <span className="hidden text-xl font-bold tracking-tight sm:block">
            <span className="neon-gradient">DevConnect</span>
          </span>
        </Link>

        {/* Navigation */}
        <NavLinks isAdmin={isAdmin} />

        {/* User section */}
        <div className="flex items-center gap-2.5">
          {session?.user ? (
            <>
              {/* Desktop user profile */}
              <Link
                href="/profile"
                className="group hidden items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition duration-300 hover:border-cyan-400/20 hover:bg-white/[0.06] sm:flex"
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-full bg-cyan-400/30 blur-sm opacity-0 transition group-hover:opacity-100" />

                  {/* Desktop profile image */}
                  <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 text-xs font-bold text-cyan-300">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt={userName}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>
                </div>

                <div className="max-w-28">
                  <p className="truncate text-xs font-medium text-gray-300 transition group-hover:text-cyan-300">
                    {userName}
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.9)]" />

                    <span className="text-[10px] text-gray-600">
                      Online
                    </span>
                  </div>
                </div>
              </Link>

              {/* Mobile profile button */}
              <Link
                href="/profile"
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-sm font-bold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 sm:hidden"
                aria-label="My Profile"
              >
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  userInitial
                )}
              </Link>

              {/* Sign out */}
              <form
                action={async () => {
                  "use server";

                  await signOut({
                    redirectTo: "/",
                  });
                }}
              >
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-gray-400 transition duration-300 hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <span className="hidden sm:inline">Sign out</span>

                  <span className="sm:hidden">↪</span>
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="neon-button rounded-xl px-4 py-2.5 text-sm font-semibold sm:px-5"
            >
              Sign in
              <span className="ml-1.5">→</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}