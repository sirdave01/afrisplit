"use client";

import Link from "next/link";

export default function FundPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-ink">
        ← Back to dashboard
      </Link>

      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Local Rails</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Fund or Cash Out</h1>
        <p className="mt-3 max-w-xl text-muted">
          Move money between your local African payment methods and your AfriSplit wallet powered by Pollar.
        </p>
      </div>

      {/* Fund Section */}
      <section className="mt-10 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-ink">Fund your wallet</h2>
        <p className="mt-2 text-sm text-muted">
          Add money from local methods. In production this will be automated via Flutterwave / Paystack.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {["Opay", "PalmPay", "M-Pesa", "Bank Transfer", "Chipper Cash", "Agent / P2P"].map((method) => (
            <button
              key={method}
              className="rounded-xl border border-ink/10 px-4 py-3 text-left text-sm font-medium transition hover:border-coral hover:bg-[#fff8f5]"
            >
              {method}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-mint/50 p-4 text-sm text-ink">
          <p className="font-semibold">How it works (Sandbox flow)</p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-muted">
            <li>Choose your local payment method</li>
            <li>Send the equivalent amount to the displayed account / number</li>
            <li>Your AfriSplit (Pollar) wallet is credited with USDC</li>
          </ol>
        </div>
      </section>

      {/* Cash Out Section */}
      <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-ink">Cash Out</h2>
        <p className="mt-2 text-sm text-muted">
          Convert your USDC balance back to local currency and withdraw.
        </p>

        <div className="mt-6 space-y-3">
          <input
            type="number"
            placeholder="Amount in USDC"
            className="field"
          />
          <select className="field">
            <option>Select destination</option>
            <option>Opay</option>
            <option>PalmPay</option>
            <option>Bank Account</option>
            <option>M-Pesa</option>
          </select>
          <button className="w-full rounded-full bg-ink py-3 font-bold text-paper transition hover:bg-coral">
            Request Cash Out
          </button>
        </div>

        <p className="mt-4 text-xs text-muted">
          This is a documented semi-manual flow for the hackathon. Full automation will use local payment APIs + Pollar.
        </p>
      </section>
    </div>
  );
}