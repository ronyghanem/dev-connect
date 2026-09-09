"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLinksProps = {
  isAdmin: boolean;
};

export default function NavLinks({ isAdmin }: NavLinksProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/developers",
      label: "Developers",
    },
    ...(isAdmin
      ? [
          {
            href: "/developers-crud",
            label: "Manage Developers",
          },
        ]
      : []),
    {
      href: "/posts",
      label: "Posts",
    },
    {
      href: "/profile",
      label: "My Profile",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Desktop navigation */}
      <div className="hidden items-center gap-1 md:flex">
        {links.map((link) => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}

              {active && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {/* Mobile dropdown */}
        {open && (
          <div className="absolute left-4 right-4 top-[calc(100%+8px)] rounded-2xl border border-white/10 bg-[#0b0d1a]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.label}</span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}