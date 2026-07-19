import { Suspense } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { Navbar } from "@/components/ui/Navbar";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Marquee } from "@/components/ui/Marquee";
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
      <Preloader />
      <Suspense fallback={null}>
        <BackgroundFieldClient />
      </Suspense>
      <CursorFollower />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Showcase />
        <Marquee
          items={[
            "Backend Engineer",
            "AI Engineer",
            "Open Source",
            "Cloud Architecture",
            "Microservices",
          ]}
          baseVelocity={2}
        />
        <About />
        <TechStack />
        <Projects />
        <Timeline />
        <Marquee
          items={[
            "TypeScript",
            "NestJS",
            "PostgreSQL",
            "Docker",
            "AWS",
            "Python",
            "Kubernetes",
            "Redis",
          ]}
          baseVelocity={-2}
        />
        <GithubSection />
        <Contact />
      </main>
    </SmoothScrollProvider>
  );
}
