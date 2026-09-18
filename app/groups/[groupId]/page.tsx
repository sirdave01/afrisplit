"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePollar } from "@pollar/react";
import { useEffect, useState, useCallback } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import PayShareButton from "@/components/PayShareButton";
import { DEFAULT_AFRICAN_CURRENCY, formatCurrency, isAfricanCurrency } from "@/lib/currency";

type User = { _id: string; name?: string; email?: string; pollarId?: string };
type Member = { _id: string; userId: User };
type Share = { userId: string; amount: number; paid: boolean };
type Expense = {
  _id: string;
  title: string;
  amount: number;
  paidBy: User;
  shares: Share[];
};
type Group = { _id: string; name: string; description?: string; currency?: string };

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { wallet } = usePollar();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGroup = useCallback(async () => {
    setLoading(true);

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
      void loadGroup();
    });
  }, [loadGroup]);

  const total = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
  const currency = (group?.currency || DEFAULT_AFRICAN_CURRENCY).toUpperCase();
  const safeCurrency = isAfricanCurrency(currency) ? currency : DEFAULT_AFRICAN_CURRENCY;

  const currentUser = members.find(
    (member) => member.userId?.pollarId === wallet?.address
  )?.userId;

  // Calculate how much the current user still owes
  const currentShare = expenses.reduce((sum, expense) => {
    const share = expense.shares.find(
      (item) =>
        item.userId === currentUser?._id ||
        item.userId?.toString() === currentUser?._id
    );
    return sum + (share && !share.paid ? Number(share.amount) || 0 : 0);
  }, 0);

  // Calculate outstanding balance per member
  const memberBalances = members.map((member) => {
    const owed = expenses.reduce((sum, expense) => {
      const share = expense.shares.find(
        (s) =>
          s.userId === member.userId._id ||
          s.userId?.toString() === member.userId._id
      );
      return sum + (share && !share.paid ? Number(share.amount) || 0 : 0);
    }, 0);

    return {
      member,
      owed,
    };
  });

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

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Left side */}
        <section>
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Group overview</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">
              {group.name}
            </h1>
            <p className="mt-3 max-w-xl text-muted">
              {group.description || "Keep the group spend clear and fair."}
            </p>
          </div>

          <ExpenseForm
            groupId={groupId}
            pollarId={wallet?.address || ""}
            members={expenseMembers}
            currency={safeCurrency}
            onCreated={loadGroup}
          />

          {/* Expenses List */}
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
              <div className="space-y-4">
                {expenses.map((expense) => {
                  const isPaidByMe =
                    expense.paidBy?._id === currentUser?._id ||
                    expense.paidBy?.pollarId === wallet?.address;

                  return (
                    <article
                      key={expense._id}
                      className="rounded-2xl border border-ink/10 bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-ink">{expense.title}</h3>
                          <p className="mt-1 text-sm text-muted">
                            {isPaidByMe ? (
                              <span className="font-medium text-coral">You paid this</span>
                            ) : (
                              <>Paid by {expense.paidBy?.name || "a group member"}</>
                            )}
                          </p>
                        </div>
                        <strong className="font-display text-xl text-ink">
                          {formatCurrency(expense.amount, safeCurrency)}
                        </strong>
                      </div>

                      {/* Who still owes */}
                      <div className="mt-4 border-t border-ink/5 pt-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                          Outstanding
                        </p>
                        <div className="space-y-1">
                          {expense.shares
                            .filter((share) => !share.paid)
                            .map((share) => {
                              const person = members.find(
                                (m) =>
                                  m.userId._id === share.userId ||
                                  m.userId._id === share.userId?.toString()
                              )?.userId;

                              const isMe = person?._id === currentUser?._id;

                              return (
                                <div
                                  key={share.userId}
                                  className="flex justify-between text-sm"
                                >
                                  <span className={isMe ? "font-medium text-coral" : "text-muted"}>
                                    {isMe ? "You" : person?.name || "Member"}
                                  </span>
                                  <span className="font-medium">{formatCurrency(share.amount, safeCurrency)}</span>
                                </div>
                              );
                            })}

                          {expense.shares.every((s) => s.paid) && (
                            <p className="text-sm text-green-600">Everyone has paid ✓</p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-ink p-6 text-paper">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Group total</p>
            <p className="mt-3 font-display text-4xl font-bold">
              {formatCurrency(total, safeCurrency)}
            </p>
            <p className="mt-2 text-sm text-paper/65">
              Across {members.length} {members.length === 1 ? "member" : "members"}
            </p>
          </div>

          {/* Member Balances */}
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="font-display text-xl font-bold text-ink">Balances</h2>
            <div className="mt-4 space-y-3">
              {memberBalances.map(({ member, owed }) => {
                const isMe = member.userId._id === currentUser?._id;
                return (
                  <div key={member._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-mint text-sm font-bold text-ink">
                        {(member.userId.name || "?").slice(0, 1).toUpperCase()}
                      </div>
                      <p className={`text-sm font-medium ${isMe ? "text-coral" : "text-ink"}`}>
                        {isMe ? "You" : member.userId.name || "Unnamed"}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${owed > 0 ? "text-coral" : "text-muted"}`}>
                      {owed > 0 ? formatCurrency(owed, safeCurrency) : "Settled"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {currentShare > 0 && (
            <div className="rounded-2xl border border-coral/20 bg-[#fff1eb] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral-dark">
                Your balance
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                {formatCurrency(currentShare, safeCurrency)}
              </p>
              <PayShareButton amount={currentShare} currency={safeCurrency} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}