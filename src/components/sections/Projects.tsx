"use client";

import { useRef, MouseEvent } from "react";
import { ExternalLink } from "lucide-react";
import { Github } from "@/components/ui/icons";
import { projects } from "@/lib/data";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";

function TiltPreview({ accent, id }: { accent: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  };

  const onLeave = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative h-64 w-full md:h-80"
      style={{ perspective: 1000 }}
    >
      <div
        ref={ref}
        className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] transition-transform duration-300 ease-out"
      >
        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 rounded-md bg-white/5 px-3 py-0.5 text-[10px] text-neutral-500">
            {id}
          </span>
        </div>
        <div className="space-y-3 p-6">
          <div className={`h-4 w-1/3 rounded bg-gradient-to-r ${accent} opacity-80`} />
          <div className="h-2.5 w-4/5 rounded bg-white/10" />
          <div className="h-2.5 w-3/5 rounded bg-white/10" />
          <div className="h-2.5 w-2/3 rounded bg-white/10" />
          <div className="mt-5 grid grid-cols-4 items-end gap-2">
            {[40, 70, 55, 90, 65, 80, 45, 95].map((h, i) => (
              <div
                key={i}
                className={`rounded-t bg-gradient-to-t ${accent} opacity-50`}
                style={{ height: `${h * 0.9}px` }}
              />
            ))}
          </div>
        </div>
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-[0.06]`}
        />
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-32 md:px-16">
      <Reveal className="mb-16 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.4em] text-violet-400">
          Deep Dives
        </span>
        <h2 className="mt-3 text-4xl font-black uppercase tracking-tight md:text-6xl">
          Featured <span className="text-gradient">Projects</span>
        </h2>
      </Reveal>

      <div className="space-y-10">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="sticky"
            style={{ top: `${96 + i * 28}px` }}
          >
            <div
              className="glass overflow-hidden rounded-3xl shadow-2xl"
              style={{
                transform: `scale(${1 - (projects.length - 1 - i) * 0.015})`,
              }}
            >
              <div className={`h-1 w-full bg-gradient-to-r ${p.accent}`} />
              <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12">
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                    {String(i + 1).padStart(2, "0")} · {p.year}
                  </span>
                  <h3 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                    {p.title}
                  </h3>
                  <p className={`mt-1 bg-gradient-to-r ${p.accent} bg-clip-text text-lg font-semibold text-transparent`}>
                    {p.subtitle}
                  </p>
                  <p className="mt-5 font-light leading-relaxed text-neutral-400">
                    {p.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300 ring-1 ring-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-4">
                    <Magnetic strength={0.25}>
                      <a
                        href={p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-violet-400"
                      >
                        <Github className="h-4 w-4" /> Repository
                      </a>
                    </Magnetic>
                    <Magnetic strength={0.25}>
                      <a
                        href={p.demo ?? p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-violet-500/50"
                      >
                        <ExternalLink className="h-4 w-4" /> Live Demo
                      </a>
                    </Magnetic>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <TiltPreview accent={p.accent} id={p.id} />
                  <div className="grid grid-cols-3 gap-3">
                    {p.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl bg-white/5 p-3 text-center ring-1 ring-white/10"
                      >
                        <div className={`bg-gradient-to-r ${p.accent} bg-clip-text text-xl font-black text-transparent`}>
                          {m.value}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
