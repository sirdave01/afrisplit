"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePollar } from "@pollar/react";
import { useEffect, useState, useCallback } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import PayShareButton from "@/components/PayShareButton";

type User = { _id: string; name?: string; email?: string; pollarId?: string };
type Member = { _id: string; userId: User };
type Expense = {
  _id: string;
  title: string;
  amount: number;
  paidBy: User;
  shares: { userId: string; amount: number; paid: boolean }[];
};
type Group = { _id: string; name: string; description?: string };

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { wallet } = usePollar();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGroup = useCallback(async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) {
        setError("This group could not be found.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setGroup(data.group);
      setMembers(data.members || []);
      setExpenses(data.expenses || []);
      setError("");
    } catch {
      setError("Failed to load group.");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    queueMicrotask(() => {
      setLoading(true);
      void loadGroup();
    });
  }, [loadGroup]);

  const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  const currentUser = members.find(
    (member) => member.userId?.pollarId === wallet?.address
  )?.userId;

  const currentShare = expenses.reduce((sum, expense) => {
    const share = expense.shares.find(
      (item) => item.userId === currentUser?._id || item.userId?.toString() === currentUser?._id
    );
    return sum + (share && !share.paid ? share.amount : 0);
  }, 0);

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

  const expenseMembers = members.map((member) => member.userId);

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
                      ${expense.amount.toFixed(2)}
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
            <p className="mt-3 font-display text-4xl font-bold">${total.toFixed(2)}</p>
            <p className="mt-2 text-sm text-paper/65">
              Across {members.length} {members.length === 1 ? "member" : "members"}
            </p>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Members</h2>
              <span className="text-sm text-muted">{members.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {members.map((member) => (
                <div key={member._id} className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-mint text-sm font-bold text-ink">
                    {(member.userId.name || member.userId.email || "?").slice(0, 1).toUpperCase()}
                  </div>
                  <p className="truncate text-sm font-medium text-ink">
                    {member.userId.name || member.userId.email || "Unnamed member"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {currentShare > 0 && (
            <div className="rounded-2xl border border-coral/20 bg-[#fff1eb] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-dark">Your balance</p>
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                ${currentShare.toFixed(2)}
              </p>
              <PayShareButton amount={currentShare} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}