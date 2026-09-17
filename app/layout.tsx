// Defines the shared document shell, metadata, fonts, and Pollar context for every route.
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PollarProvider } from "@pollar/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AfriSplit",
  description: "Split bills easily with friends using Pollar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PollarProvider
          client={{
            apiKey: process.env.NEXT_PUBLIC_POLLAR_PUBLISHABLE_KEY!,
          }}
          appConfig={{
            application: {
              name: "AfriSplit",
              network: "testnet",
              chains: [],
            },
            styles: {},
          }}
        >
          {children}
        </PollarProvider>
      </body>
    </html>
  );
}