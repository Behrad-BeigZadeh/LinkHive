"use client";

import Link from "next/link";

interface Link {
  title: string;
  url: string;
}

export default function LinkCard({ link }: { link: Link }) {
  return (
    <Link
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-center px-6 py-2 rounded-lg border border-emerald-300 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
    >
      {link.title}
    </Link>
  );
}
