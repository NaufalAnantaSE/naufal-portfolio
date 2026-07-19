"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Mail, ArrowUpRight } from "lucide-react";
import { Github, Linkedin, Instagram } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { socials } from "@/lib/data";

const ContactOrbScene = dynamic(
  () => import("@/components/three/ContactOrbScene"),
  { ssr: false }
);

const links = [
  { icon: Mail, label: "Email", value: "naufalananta@example.com", href: socials.email },
  { icon: Github, label: "GitHub", value: "@Naufall1", href: socials.github },
  { icon: Linkedin, label: "LinkedIn", value: "in/naufalananta", href: socials.linkedin },
  { icon: Instagram, label: "Instagram", value: "@naufalananta", href: socials.instagram },
];

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32 md:px-16">
      <div className="relative mx-auto max-w-7xl">
        <div className="absolute inset-0 -z-0 opacity-70">
          <Suspense fallback={null}>
            <ContactOrbScene className="h-full min-h-[500px] w-full" />
          </Suspense>
        </div>

        <div className="relative z-10 flex min-h-[500px] flex-col items-center justify-center text-center">
          <Reveal>
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-violet-400">
              Let&apos;s Connect
            </span>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
              Let&apos;s Build
              <br />
              <span className="text-gradient">Something</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md font-light text-neutral-400">
              Have an idea, a project, or an opportunity? My inbox is always
              open — let&apos;s talk.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {links.map((l) => (
                <Magnetic key={l.label} strength={0.3}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="glass group flex items-center gap-3 rounded-full px-6 py-3.5 transition-all duration-300 hover:border-violet-500/50 hover:glow-violet"
                  >
                    <l.icon className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-medium text-white">
                      {l.value}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-400" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <footer className="relative z-10 mx-auto mt-24 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-neutral-600 md:flex-row">
        <span>© {new Date().getFullYear()} Naufal Ananta. Crafted with obsession.</span>
        <span className="flex items-center gap-1">
          Telkom University Purwokerto · Indonesia
        </span>
        <span>Next.js · Three.js · Framer Motion</span>
      </footer>
    </section>
  );
}
