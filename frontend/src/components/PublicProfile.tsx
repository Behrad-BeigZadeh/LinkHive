"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/apis/linksApi";
import { useRouter } from "next/navigation";
import LinkCard from "./LinkCard";
import { Copy, Check } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
}

interface Profile {
  username: string;
  avatarUrl?: string;
  bio?: string | null;
  links: Link[];
}

export default function PublicProfile({ username }: { username: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<Profile>({
    queryKey: ["public-profile", username],
    queryFn: () => getPublicProfile(username),
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-cyan-400 border-white/10" />
      </div>
    );
  }

  if (isError || !profile) {
    router.replace("/not-found");
    return null;
  }

  const { avatarUrl, bio, links } = profile;

  const handleCopy = () => {
    const url = `${window.location.origin}/public-page/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    startTransition(() => {
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full  max-w-md mx-auto rounded-xl p-6  bg-zinc-900/60 backdrop-blur-md border border-emerald-500 text-white  ">
      <div className="flex flex-col items-center text-center">
        {avatarUrl ? (
          <img
            loading="lazy"
            src={avatarUrl}
            alt="User Avatar"
            className="w-28 h-28 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-700 rounded-full mb-4" />
        )}
        <h1 className="text-xl font-bold">@{profile.username}</h1>
        {bio && <p className="text-sm text-gray-400 mt-2">{bio}</p>}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="mt-3 text-sm text-emerald-400 hover:underline flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Public Link
            </>
          )}
        </button>
      </div>

      <div className="mt-6 space-y-4 ">
        {links.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No active links to show.
          </p>
        ) : (
          links.map((link: Link) => <LinkCard key={link.id} link={link} />)
        )}
      </div>
    </div>
  );
}
