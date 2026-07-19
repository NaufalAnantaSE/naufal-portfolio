import { Suspense } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { GithubSection } from "@/components/sections/GithubSection";
import { Contact } from "@/components/sections/Contact";
import { BackgroundFieldClient } from "@/components/three/BackgroundFieldClient";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Suspense fallback={null}>
        <BackgroundFieldClient />
      </Suspense>
      <CursorFollower />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Showcase />
        <About />
        <TechStack />
        <Projects />
        <Timeline />
        <GithubSection />
        <Contact />
      </main>
    </SmoothScrollProvider>
  );
}
