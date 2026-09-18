"use client";

import { useState } from "react";

type Member = {
	_id: string;
	name?: string;
	email?: string;
};

type ExpenseFormProps = {
	groupId: string;
	pollarId: string;
	members: Member[];
	onCreated: () => void;
};

export default function ExpenseForm({ groupId, pollarId, members, onCreated }: ExpenseFormProps) {
	const [title, setTitle] = useState("");
	const [amount, setAmount] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitting(true);
		setError("");

		const response = await fetch("/api/expenses", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ groupId, title, amount, pollarId, memberIds: members.map((member) => member._id) }),
		});

		if (!response.ok) {
			const result = await response.json();
			setError(result.error || "Could not save expense.");
			setSubmitting(false);
			return;
		}

		setTitle("");
		setAmount("");
		setSubmitting(false);
		onCreated();
	}

	return (
		<form onSubmit={handleSubmit} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
			<div className="mb-5">
				<p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">New expense</p>
				<h2 className="mt-1 font-display text-2xl font-bold text-ink">What did the group spend?</h2>
			</div>
			<div className="grid gap-4 sm:grid-cols-[1fr_150px]">
				<label className="text-sm font-semibold text-ink">
					Description
					<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Dinner at Osu" className="field mt-2" />
				</label>
				<label className="text-sm font-semibold text-ink">
					Amount
					<input value={amount} onChange={(event) => setAmount(event.target.value)} required min="0.01" step="0.01" type="number" placeholder="0.00" className="field mt-2" />
				</label>
			</div>
			{error && <p className="mt-3 text-sm font-medium text-coral-dark">{error}</p>}
			<button disabled={submitting || members.length === 0} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper transition hover:bg-coral disabled:opacity-50">
				{submitting ? "Saving..." : "Split this expense"}
			</button>
		</form>
	);
}
