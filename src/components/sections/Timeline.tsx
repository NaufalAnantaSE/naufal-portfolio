"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { timeline } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="relative mx-auto max-w-5xl px-6 py-32 md:px-16">
      <Reveal className="mb-20 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.4em] text-violet-400">
          The Journey
        </span>
        <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">
          From <span className="text-gradient">Zero</span> to Shipping
        </h2>
      </Reveal>

      <div ref={ref} className="relative">
        {/* Track */}
        <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-4 top-0 w-px bg-gradient-to-b from-violet-500 via-blue-500 to-orange-500 shadow-[0_0_12px_rgba(139,92,246,0.8)] md:left-1/2"
        />

        <div className="space-y-16">
          {timeline.map((item, i) => {
            const left = i % 2 === 0;
            return (
              <Reveal key={i} delay={0.05}>
                <div
                  className={`relative flex items-start gap-8 pl-12 md:w-1/2 md:pl-0 ${
                    left
                      ? "md:pr-14 md:text-right"
                      : "md:ml-auto md:pl-14"
                  }`}
                >
                  {/* Node */}
                  <div
                    className={`absolute top-1 flex h-8 w-8 items-center justify-center rounded-full glass glow-violet ${
                      left
                        ? "-left-4 md:-right-4 md:left-auto"
                        : "-left-4 md:-left-4"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                  </div>

                  <div className="glass w-full rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                    <span className="text-gradient-static text-sm font-bold uppercase tracking-widest">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-relaxed text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
