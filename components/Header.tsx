import Link from "next/link";

export default function Header() {
	return (
		<header className="border-b border-ink/10 bg-paper/85 backdrop-blur">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
				<Link href="/dashboard" className="font-display text-xl font-bold tracking-tight text-ink">
					Afri<span className="text-coral">Split</span>
				</Link>
				<nav className="flex items-center gap-5 text-sm font-medium text-muted">
					<Link href="/dashboard" className="transition hover:text-ink">Dashboard</Link>
					<Link href="/groups" className="transition hover:text-ink">Groups</Link>
					<Link href="/groups/new" className="rounded-full bg-ink px-4 py-2 text-paper transition hover:bg-coral">New group</Link>
				</nav>
			</div>
		</header>
	);
}
