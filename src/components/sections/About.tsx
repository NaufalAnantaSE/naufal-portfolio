"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Reveal } from "@/components/ui/Reveal";

const AboutAssetsScene = dynamic(
  () => import("@/components/three/AboutAssetsScene"),
  { ssr: false }
);

const traits = [
  { label: "Software Engineer", color: "text-violet-300 border-violet-500/30 bg-violet-600/10" },
  { label: "Backend Specialist", color: "text-blue-300 border-blue-500/30 bg-blue-600/10" },
  { label: "AI Builder", color: "text-orange-300 border-orange-500/30 bg-orange-600/10" },
  { label: "Cloud Enthusiast", color: "text-cyan-300 border-cyan-500/30 bg-cyan-600/10" },
  { label: "Open Source Contributor", color: "text-emerald-300 border-emerald-500/30 bg-emerald-600/10" },
];

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-32 md:px-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-violet-400">
              About Me
            </span>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              Engineer of <br />
              <span className="text-gradient">Invisible Things</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 text-lg font-light leading-relaxed text-neutral-400">
              I&apos;m Naufal Ananta — a software engineer from Indonesia,
              currently studying at{" "}
              <span className="text-white">Telkom University Purwokerto</span>.
              I live in the layer users never see: the APIs, the queues, the
              databases, the pipelines — and I make them fast, resilient, and
              elegant.
            </p>
            <p className="mt-4 text-lg font-light leading-relaxed text-neutral-400">
              From benchmarking gRPC against REST under brutal load, to wiring
              AI into production backends — I build systems that scale and
              share what I learn in the open.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              {traits.map((t) => (
                <span
                  key={t.label}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium ${t.color}`}
                >
                  {t.label}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "60+", l: "Repositories" },
                { v: "3+", l: "Years Coding" },
                { v: "∞", l: "Curiosity" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-2xl p-4 text-center">
                  <div className="text-gradient-static text-3xl font-black">{s.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="relative h-[420px] md:h-[560px]">
          <div className="glass absolute inset-0 overflow-hidden rounded-3xl">
            <Suspense fallback={null}>
              <AboutAssetsScene className="absolute inset-0" />
            </Suspense>
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-neutral-500 backdrop-blur">
              My universe of tools
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
