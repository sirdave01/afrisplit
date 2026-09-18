"use client";

import { usePollar } from "@pollar/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AFRICAN_CURRENCIES, DEFAULT_AFRICAN_CURRENCY } from "@/lib/currency";

export default function NewGroupPage() {
  const { wallet } = usePollar();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState<string>(DEFAULT_AFRICAN_CURRENCY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet?.address) return;

    setLoading(true);
    setError("");
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        currency,
        pollarId: wallet.address,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push(`/groups/${data._id}`);
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-5 py-12 lg:px-8">
      <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-ink">← Back to dashboard</Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-coral">Start a shared plan</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-ink">Create a new group.</h1>
      <p className="mt-3 text-muted">Give your crew a home for every receipt and repayment.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-semibold text-ink">Group name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="field mt-2"
            placeholder="e.g. Weekend Hangout"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink">Description <span className="font-normal text-muted">(optional)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="field mt-2"
            rows={3}
            placeholder="What's this group for?"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink">Primary currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="field mt-2"
          >
            {AFRICAN_CURRENCIES.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm font-medium text-coral-dark">{error}</p>}
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full rounded-full bg-ink py-3 font-bold text-paper transition hover:bg-coral disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
}