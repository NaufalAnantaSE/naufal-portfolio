"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { socials } from "@/lib/data";

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
    <section id="about" className="section-rule relative mx-auto max-w-7xl px-6 py-32 md:px-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-violet-400">
              About Me
            </span>
            <SplitText
              as="h2"
              text="Engineer of Invisible Things"
              className="mt-3 text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl"
            />
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 text-lg font-light leading-relaxed text-neutral-400">
              I&apos;m Naufal Ananta — a Software Engineer from Indonesia with a
              Bachelor of Software Engineering (S.T.) from{" "}
              <span className="text-white">Telkom University Purwokerto</span> (GPA 3.52/4.00).
              I specialize in the core engine layer: scalable APIs, microservice protocols,
              event queues, and automated DevOps infrastructure.
            </p>
            <p className="mt-4 text-lg font-light leading-relaxed text-neutral-400">
              From quantitatively benchmarking gRPC vs REST under synthetic peak load, to
              engineering EMVCo-compliant dynamic QRIS payment gateways and AI tooling —
              I design resilient software backed by real empirical metrics.
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
            <div className="mt-6">
              <a
                href={socials.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600/20 border border-violet-500/40 px-5 py-2.5 text-sm font-semibold text-violet-300 transition-all hover:bg-violet-600 hover:text-white"
              >
                <span>View Full Curriculum Vitae (PDF)</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: "64", l: "Repositories" },
                { v: "62", l: "Stars Earned" },
                { v: "278", l: "Contributions" },
              ].map((s) => (
                <SpotlightCard
                  key={s.l}
                  className="glass rounded-2xl p-4 text-center"
                  glowColor="rgba(139, 92, 246, 0.18)"
                >
                  <div className="text-gradient-static text-3xl font-black">{s.v}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                    {s.l}
                  </div>
                </SpotlightCard>
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
