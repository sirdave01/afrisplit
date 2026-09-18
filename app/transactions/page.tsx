"use client";

import Link from "next/link";
import { usePollar } from "@pollar/react";
import { useEffect, useState } from "react";
import { AFRICAN_CURRENCIES, formatCurrency, type AfricanCurrency } from "@/lib/currency";

type Transaction = {
  id: string;
  type: "fund" | "cashout" | "payment";
  amount: number;
  currency: AfricanCurrency;
  description: string;
  date: string;
  status: "completed" | "pending";
};

const BASE_TRANSACTIONS = [
  {
    id: "1",
    type: "fund",
    amount: 50,
    description: "Funded via Opay",
    date: "18 Sep 2026, 10:24 AM",
    status: "completed",
  },
  {
    id: "2",
    type: "payment",
    amount: 15.5,
    description: "Paid share for Weekend Hangout",
    date: "18 Sep 2026, 11:05 AM",
    status: "completed",
  },
  {
    id: "3",
    type: "cashout",
    amount: 20,
    description: "Cash out to PalmPay",
    date: "18 Sep 2026, 12:40 PM",
    status: "pending",
  },
] as const;

export default function TransactionsPage() {
  const { isAuthenticated } = usePollar();

  // Temporary mock data (for demo)
  // Later this can come from your database or Pollar
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    BASE_TRANSACTIONS.map((transaction) => ({ ...transaction, currency: "NGN" }))
  );

  useEffect(() => {
    queueMicrotask(() => {
      setTransactions(
        BASE_TRANSACTIONS.map((transaction) => ({
          ...transaction,
          currency: AFRICAN_CURRENCIES[Math.floor(Math.random() * AFRICAN_CURRENCIES.length)],
        }))
      );
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-muted">Please login to view your transactions.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-coral font-medium">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-ink">
        ← Back to dashboard
      </Link>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Activity</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Transactions</h1>
        <p className="mt-3 text-muted">
          History of funding, cash outs, and payments linked to your AfriSplit wallet.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center text-muted">
            No transactions yet.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${
                    tx.type === "fund"
                      ? "bg-mint text-ink"
                      : tx.type === "cashout"
                      ? "bg-[#fff1eb] text-coral"
                      : "bg-ink/5 text-ink"
                  }`}
                >
                  {tx.type === "fund" ? "+" : tx.type === "cashout" ? "↑" : tx.currency}
                </div>

                <div>
                  <p className="font-semibold text-ink">{tx.description}</p>
                  <p className="mt-1 text-sm text-muted">{tx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-display text-lg font-bold ${
                    tx.type === "fund" ? "text-green-600" : "text-ink"
                  }`}
                >
                  {tx.type === "fund" ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)}
                </p>
                <p
                  className={`text-xs font-medium ${
                    tx.status === "completed" ? "text-muted" : "text-coral"
                  }`}
                >
                  {tx.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        This is a demo transaction history. In production it will pull real data from Pollar + local payment providers.
      </p>
    </div>
  );
}