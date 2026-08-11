import Preloader from "@/components/Preloader";
import HeroScrubber from "@/components/HeroScrubber";
import LedMatrix from "@/components/LedMatrix";
import ProjectShowcase from "@/components/ProjectShowcase";
import ArchitectureView from "@/components/ArchitectureView";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <Preloader />
      <main className="relative">
        <HeroScrubber />
        <LedMatrix />
        <ProjectShowcase />
        <ArchitectureView />
        <ContactFooter />
      </main>
    </>
  );
}
