"use client";

type PayShareButtonProps = {
	amount: number;
	disabled?: boolean;
};

export default function PayShareButton({ amount, disabled = false }: PayShareButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={() => window.alert(`Payment flow for $${amount.toFixed(2)} will open here.`)}
			className="rounded-full bg-coral px-4 py-2 text-sm font-bold text-white transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-50"
		>
			Pay my ${amount.toFixed(2)}
		</button>
	);
}
