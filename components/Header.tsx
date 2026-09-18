import Link from "next/link";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link
          href="/dashboard"
          className="font-display text-xl font-bold tracking-tight text-ink"
        >
          Afri<span className="text-coral">Split</span>
        </Link>

        <NavLinks />
      </div>
    </header>
  );
}