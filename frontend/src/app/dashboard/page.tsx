"use client";
import LinkList from "@/components/dashboard/LinkList";
import LinksAnalytics from "@/components/dashboard/LinksAnalytics";
import NeonButton from "@/components/NeonButton";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4"
    >
      {" "}
      <div className="max-w-4xl mx-auto flex justify-between items-center pb-3 px-4">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div>
          <Link href="/dashboard/edit-profile">
            <NeonButton
              textSize="text-[10px]  lg:text-sm"
              text="Edit Profile"
              color="cyan"
            />
          </Link>
        </div>
      </div>
      <div className="mt-8">
        <LinkList />
      </div>
      <div className="mt-8">
        <LinksAnalytics />
      </div>
    </motion.section>
  );
}
