"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { categories } from "@/lib/data";

const TechSphereScene = dynamic(
  () => import("@/components/three/TechSphereScene"),
  { ssr: false }
);

const filters = ["All", ...categories];

export function TechStack() {
  const [active, setActive] = useState("All");

  return (
    <section id="stack" className="relative mx-auto max-w-7xl px-6 py-32 md:px-16">
      <Reveal className="text-center">
        <span className="text-xs font-medium uppercase tracking-[0.4em] text-violet-400">
          Arsenal
        </span>
        <SplitText
          as="h2"
          text="Tech Universe"
          className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl"
        />
        <p className="mx-auto mt-4 max-w-md text-neutral-400">
          Hover a sphere — every one is a technology I&apos;ve shipped with.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                active === c
                  ? "bg-violet-600 text-white glow-violet"
                  : "glass text-neutral-400 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <div className="glass mt-8 h-[480px] overflow-hidden rounded-3xl md:h-[600px]">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-neutral-600">
                Loading universe…
              </div>
            }
          >
            <TechSphereScene key={active} category={active} className="h-full w-full" />
          </Suspense>
        </div>
      </Reveal>
    </section>
  );
}
