"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { socials } from "@/lib/data";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-3xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
          scrolled ? "glass glow-violet" : "border border-transparent"
        }`}
      >
        <a
          href="#top"
          className="text-lg font-bold tracking-tight text-gradient-static"
        >
          NA.
        </a>
        <ul className="hidden items-center gap-6 text-sm text-neutral-400 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="transition-colors duration-200 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Magnetic strength={0.25}>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-violet-600"
            >
              GitHub
            </a>
          </Magnetic>
          <button
            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-violet-600 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass absolute left-3 right-3 top-16 z-50 rounded-3xl p-5 shadow-2xl md:hidden"
          >
            <ul className="space-y-3 text-sm text-neutral-200">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-600"
            >
              GitHub
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
