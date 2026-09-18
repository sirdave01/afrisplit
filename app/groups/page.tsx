import Link from "next/link";

export default function GroupsPage() {
	return (
		<div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8">
			<p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Groups</p>
			<h1 className="mt-3 font-display text-4xl font-bold text-ink">All your shared plans, in one place.</h1>
			<p className="mx-auto mt-4 max-w-lg text-muted">Your group list lives on the dashboard so you can jump straight into the expense that needs attention.</p>
			<Link href="/dashboard" className="mt-7 inline-block rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper hover:bg-coral">Open dashboard</Link>
		</div>
	);
}
