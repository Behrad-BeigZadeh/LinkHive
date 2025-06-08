"use client";

import Link from "next/link";
import NeonButton from "./NeonButton";

export default function HeroSection() {
  return (
    <section className="relative w-full pt-28 pb-16 px-4 sm:px-8 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6 lg:whitespace-nowrap">
            One Link to Rule Them All
          </h1>
          <p className="text-zinc-300 text-lg mb-8 max-w-lg">
            Create your personal link-in-bio profile. Organize your links, share
            your social presence, and track your clicks — all in one place.
          </p>

          <div className="text-center ">
            <Link href="/auth/signup">
              <NeonButton full text="Get Started" color="fuchsia" />
            </Link>
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-center">
          <div className="flex-1 hidden md:flex justify-center">
            <img
              loading="lazy"
              src="https://res.cloudinary.com/dc0quhvpm/image/upload/v1749193483/linkHive-portrait_qtiwxg.png"
              alt="LinkHive Dashboard Preview"
              className="w-full max-w-[280px] h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
