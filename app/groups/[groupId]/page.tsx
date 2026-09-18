"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePollar } from "@pollar/react";
import { useEffect, useState, useCallback } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import PayShareButton from "@/components/PayShareButton";
import { formatCurrency } from "@/lib/currency";

// Represent a registered user in the app. most of our membership logic uses the
// wallet-based Pollar ID, but we also keep name/email for nicer display.
type User = { _id: string; name?: string; email?: string; pollarId?: string };
type Member = { _id: string; userId: User };
type Expense = {
  _id: string;
  title: string;
  amount: number;
  paidBy: User;
  shares: { userId: string; amount: number; paid: boolean }[];
};
type Group = { _id: string; name: string; description?: string; currency?: string };

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { wallet } = usePollar();

  // Group detail state is loaded from the API and re-used across several UI blocks.
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // This fetch is the main data source for the page. it is re-used after creating a
  // new expense or adding a new member so the UI stays in sync with the server state.
  const loadGroup = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) {
        setError("This group could not be found.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setGroup(data.group ?? null);
      setMembers(Array.isArray(data.members) ? data.members : []);
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
      setError("");
    } catch {
      setError("Failed to load group.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    // queueMicrotask keeps the flow consistent with the app's current pattern, but we
    // still guard the fetch with a real async function so the UI can recover from errors.
    queueMicrotask(() => {
      setLoading(true);
      void loadGroup();
    });
  }, [loadGroup]);

  const total = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
  const currency = (group?.currency || "NGN").toUpperCase();

  // A current user's share is computed from the saved expense shares, so we can show
  // the exact unsettled balance for the wallet currently connected to Pollar.
  const currentUser = members.find(
    (member) => member.userId?.pollarId === wallet?.address
  )?.userId;

  const currentShare = expenses.reduce((sum, expense) => {
    const share = expense.shares?.find(
      (item) => item.userId === currentUser?._id || item.userId?.toString() === currentUser?._id
    );
    return sum + (share && !share.paid ? Number(share.amount) || 0 : 0);
  }, 0);

  const handleAddMember = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inviteName.trim()) {
      setInviteError("Enter a wallet address or email to add to this group.");
      return;
    }

    setAddingMember(true);
    setInviteError("");

    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: inviteName.trim() }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Could not add member.");
      }

      setInviteName("");
      await loadGroup();
    } catch (error) {
      setInviteError(error instanceof Error ? error.message : "Could not add member.");
    } finally {
      setAddingMember(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-muted lg:px-8">
        Loading group...
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="text-coral-dark">{error || "Group not found."}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-sm font-semibold text-ink underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const expenseMembers = members
    .map((member) => member.userId)
    .filter((user): user is User => Boolean(user));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-ink">
        ← Back to dashboard
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <section>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Group overview</p>
            <h1 className="mt-2 font-display text-5xl font-bold text-ink">{group.name}</h1>
            <p className="mt-3 max-w-xl text-muted">
              {group.description || "Keep the group spend clear and fair."}
            </p>
          </div>

          <ExpenseForm
            groupId={groupId}
            pollarId={wallet?.address || ""}
            members={expenseMembers}
            currency={currency}
            onCreated={loadGroup}
          />

          <div className="mt-8">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-2xl font-bold text-ink">Recent expenses</h2>
              <span className="text-sm text-muted">
                {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
              </span>
            </div>

            {expenses.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-ink/20 p-8 text-center text-sm text-muted">
                No expenses yet. Add the first one above.
              </p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <article
                    key={expense._id}
                    className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5"
                  >
                    <div>
                      <h3 className="font-semibold text-ink">{expense.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        Paid by {expense.paidBy?.name || expense.paidBy?.email || "a group member"}
                      </p>
                    </div>
                    <strong className="font-display text-xl text-ink">
                      {formatCurrency(expense.amount, currency as any)}
                    </strong>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-ink p-6 text-paper">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Group total</p>
            <p className="mt-3 font-display text-4xl font-bold">{formatCurrency(total, currency as any)}</p>
            <p className="mt-2 text-sm text-paper/65">
              Across {members.length} {members.length === 1 ? "member" : "members"}
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Members</h2>
              <span className="text-sm text-muted">{members.length}</span>
            </div>

            <form onSubmit={handleAddMember} className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-ink">
                Add a member
                <input
                  value={inviteName}
                  onChange={(event) => setInviteName(event.target.value)}
                  placeholder="Wallet address or email"
                  className="field mt-2"
                />
              </label>

              {inviteError && <p className="text-sm text-coral-dark">{inviteError}</p>}

              <button
                type="submit"
                disabled={addingMember || !inviteName.trim()}
                className="w-full rounded-full bg-coral px-4 py-2 text-sm font-bold text-white transition hover:bg-coral-dark disabled:opacity-60"
              >
                {addingMember ? "Adding..." : "Add to group"}
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {members.map((member) => {
                const user = member.userId;
                if (!user) return null;

                return (
                  <div key={member._id} className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-mint text-sm font-bold text-ink">
                      {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
                    </div>
                    <p className="truncate text-sm font-medium text-ink">
                      {user.name || user.email || "Unnamed member"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {currentShare > 0 && (
            <div className="rounded-2xl border border-coral/20 bg-[#fff1eb] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-dark">Your balance</p>
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                {formatCurrency(currentShare, currency as any)}
              </p>
              <PayShareButton amount={currentShare} currency={currency} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}