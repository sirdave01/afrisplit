// A compact summary card for a group in the dashboard. It provides a quick way to
// navigate into a group's detailed spend overview and member list.

import Link from "next/link";

type GroupCardProps = {
	group: {
		_id: string;
		name: string;
		description?: string;
	};
};

export default function GroupCard({ group }: GroupCardProps) {
	return (
		<Link
			href={`/groups/${group._id}`}
			className="group block rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-coral/40 hover:shadow-md"
		>
			<div className="mb-8 flex items-start justify-between">
				<span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink">Active group</span>
				<span className="text-xl text-coral transition group-hover:translate-x-1">→</span>
			</div>
			<h2 className="font-display text-xl font-bold text-ink">{group.name}</h2>
			<p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted">
				{group.description || "Shared expenses, made easy for everyone."}
			</p>
		</Link>
	);
}
