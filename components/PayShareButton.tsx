"use client";

// This button is the payment CTA for a user who still owes money in a group.
// It formats their unpaid balance in the correct African currency and gives a
// clear action towards settling the amount.

import { formatCurrency } from "@/lib/currency";

type PayShareButtonProps = {
	amount: number;
	currency?: string;
	disabled?: boolean;
};

export default function PayShareButton({ amount, currency = "NGN", disabled = false }: PayShareButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={() => window.alert(`Payment flow for ${formatCurrency(amount, currency as any)} will open here.`)}
			className="rounded-full bg-coral px-4 py-2 text-sm font-bold text-white transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
		>
			Pay my {formatCurrency(amount, currency as any)}
		</button>
	);
}
