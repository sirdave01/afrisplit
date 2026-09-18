"use client";

import { PollarProvider } from "@pollar/react";

export default function PollarShell({ children }: { children: React.ReactNode }) {
  return (
    <PollarProvider
      client={{
        apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY!,
      }}
    >
      {children}
    </PollarProvider>
  );
}