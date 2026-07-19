import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/ui/Navbar";
import { WorldExperience } from "@/components/three/WorldExperience";
import { About } from "@/components/sections/About";
import { TechStack } from "@/components/sections/TechStack";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { GithubSection } from "@/components/sections/GithubSection";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main className="relative z-10">
        <WorldExperience />
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
