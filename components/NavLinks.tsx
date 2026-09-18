"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePollar } from "@pollar/react";
import { useState } from "react";

export default function NavLinks() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = usePollar();
  const [open, setOpen] = useState(false);

  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/groups/new", label: "New group" },
    { href: "/fund", label: "Fund / Cash Out" },
    { href: "/transactions", label: "Transactions" },
  ];

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-ink md:hidden"
        aria-label="Toggle menu"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Desktop + Mobile menu */}
      <nav
        className={`${
          open ? "flex" : "hidden"
        } absolute right-0 top-12 z-50 w-48 flex-col gap-3 rounded-xl border border-ink/10 bg-paper p-4 shadow-lg md:static md:flex md:w-auto md:flex-row md:items-center md:gap-4 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
      >
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className={pathname === "/dashboard" ? "font-semibold text-ink" : "text-muted hover:text-ink"}
        >
          Dashboard
        </Link>

        {isAuthenticated && (
          <>
            {authLinks
              .filter((link) => link.href !== "/dashboard")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={
                    pathname === link.href
                      ? "font-semibold text-ink"
                      : "text-muted hover:text-ink"
                  }
                >
                  {link.label}
                </Link>
              ))}

            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="rounded-full bg-ink px-4 py-2 text-left text-sm text-paper transition hover:bg-coral md:text-center"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
}