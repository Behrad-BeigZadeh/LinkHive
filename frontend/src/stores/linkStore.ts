import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Link = {
  id: string;
  title: string;
  url: string;
  order: number;
  isActive: boolean;
  clicks: number;
};

interface LinkStore {
  linksLength: number;
  setAllLinks: (links: Link[]) => void;
  allLinks: Link[];
  setLinksLength: (linksLength: number) => void;
}

export const useLinkSTore = create<LinkStore>()(
  persist(
    (set) => ({
      allLinks: [],
      setAllLinks: (links) => set({ allLinks: links }),
      linksLength: 0,
      setLinksLength: (linksLength) => set({ linksLength }),
    }),
    { name: "linkHive-links" }
  )
);
