"use client";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import Preview from "@/components/Preview";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="text-blue-500 mb-10"
    >
      <HeroSection />
      <FeaturesSection />
      <Preview />
    </motion.main>
  );
}
