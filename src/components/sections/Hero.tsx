"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { useRef } from "react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const roles = ["Backend Engineer", "AI Engineer", "Open Source Developer"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden"
    >
      {/* 3D scene behind text */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 flex w-full flex-col items-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass mb-6 flex items-center gap-2 rounded-full px-5 py-2 text-sm text-neutral-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for opportunities
          <span className="mx-1 h-3 w-px bg-white/20" />
          <MapPin className="h-3.5 w-3.5 text-orange-400" />
          Indonesia
        </motion.div>

        <h1 className="sr-only">Naufal Ananta — Backend & AI Engineer</h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          aria-hidden
          className="mb-2 text-sm font-light uppercase tracking-[0.6em] text-neutral-400 md:text-base"
        >
          Hello, I&apos;m
        </motion.p>

        <div
          aria-hidden
          className="w-full overflow-hidden text-center leading-[0.85]"
        >
          <motion.span
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-gradient block font-black uppercase tracking-tighter"
            style={{ fontSize: "clamp(4.5rem, 19vw, 19rem)" }}
          >
            Naufal
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 md:gap-3"
        >
          {roles.map((role, i) => (
            <span
              key={role}
              className={`rounded-full px-4 py-1.5 text-xs font-medium md:text-sm ${
                i === 0
                  ? "bg-violet-600/20 text-violet-300 ring-1 ring-violet-500/40"
                  : i === 1
                    ? "bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/40"
                    : "bg-orange-600/20 text-orange-300 ring-1 ring-orange-500/40"
              }`}
            >
              {role}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="mt-6 max-w-xl text-center text-base font-light leading-relaxed text-neutral-400 md:text-lg"
        >
          Building scalable backend systems, microservices, cloud
          infrastructure, and{" "}
          <span className="text-gradient-static font-medium">
            AI-powered applications
          </span>
          .
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 flex items-center gap-5"
        >
          <Magnetic>
            <a
              href="#work"
              className="glow-violet group relative overflow-hidden rounded-full bg-violet-600 px-8 py-4 text-sm font-semibold text-white transition-transform"
            >
              <span className="relative z-10">Explore My Work</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-600 to-violet-600 transition-transform duration-500 group-hover:translate-x-0" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="glass rounded-full px-8 py-4 text-sm font-semibold text-white transition-colors hover:border-violet-500/50"
            >
              Get in Touch
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#showcase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-neutral-500 transition-colors hover:text-white"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>

      {/* bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090909] to-transparent" />
    </section>
  );
}
