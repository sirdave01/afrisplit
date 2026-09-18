"use client";

// Dashboard page for the authenticated user. It checks whether the wallet is
// connected and then loads the groups associated with that user.

import { usePollar } from "@pollar/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import GroupCard from "@/components/GroupCard";

type Group = { _id: string; name: string; description?: string };

export default function DashboardPage() {
  const { isAuthenticated, wallet, login, getClient } = usePollar();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !wallet?.address) return;

    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const profile = getClient().getUserProfile();
        const email = profile?.mail?.trim() || "";
        const profileName = [profile?.first_name, profile?.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();
        const displayName = profileName || email.split("@")[0] || `User ${wallet.address.slice(0, 6)}`;

        try {
          const userResponse = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pollarId: wallet.address,
              email,
              name: displayName,
            }),
          });

          if (!userResponse.ok) {
            console.error("Could not register the authenticated user.");
          }
        } catch (registrationError) {
          console.error("Could not register the authenticated user.", registrationError);
        }

        const groupsResponse = await fetch(`/api/groups?pollarId=${encodeURIComponent(wallet.address)}`);
        if (!groupsResponse.ok) throw new Error("Could not load your groups.");

        const data: Group[] = await groupsResponse.json();
        if (!cancelled) setGroups(data);
      } catch {
        if (!cancelled) setError("Could not load your groups right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [getClient, isAuthenticated, wallet]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5 py-16 lg:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-coral">Shared money, less friction</p>
        <h1 className="max-w-xl font-display text-5xl font-bold leading-[0.98] text-ink sm:text-7xl">Make the split feel simple.</h1>
        <p className="mt-6 max-w-md text-lg leading-7 text-muted">Keep every group expense clear, know exactly what you owe, and settle your share without the group chat arithmetic.</p>
        <button
          onClick={() => login({ provider: "google" })}
          className="mt-8 w-fit rounded-full bg-ink px-6 py-3 font-bold text-paper transition hover:bg-coral"
        >
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Your workspace</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-ink">Good to see you.</h1>
        </div>
        <Link
          href="/groups/new"
          className="w-fit rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper transition hover:bg-coral"
        >
          + New group
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading your groups...</p>
      ) : error ? (
        <p className="rounded-xl bg-white p-5 text-sm text-coral-dark">{error}</p>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/20 bg-white/50 px-6 py-16 text-center">
          <p className="font-display text-2xl font-bold text-ink">Your first split starts here.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">Create a group for dinner, a trip, rent, or any shared plan.</p>
          <Link
            href="/groups/new"
            className="mt-5 inline-block rounded-full bg-coral px-5 py-3 text-sm font-bold text-white"
          >
            Create a group
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => <GroupCard key={group._id} group={group} />)}
        </div>
      )}
    </div>
  );
}
