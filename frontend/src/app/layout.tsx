import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClientProviders from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "LinkHive - Create Your Personal Link Page",
  description:
    "LinkHive lets you create and share your personalized bio link with analytics and easy management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-zinc-900 via-gray-950 to-black text-slate-200
`}
      >
        <ClientProviders>
          <Header />
          <main className="mt-20"> {children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
