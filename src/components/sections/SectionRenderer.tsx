import Nav from "./Nav";
import Hero from "./Hero";
import Stats from "./Stats";
import Marquee from "./Marquee";
import Showreel from "./Showreel";
import About from "./About";
import Services from "./Services";
import Projects from "./Projects";
import Process from "./Process";
import Testimonials from "./Testimonials";
import GalleryTeaser from "./GalleryTeaser";
import Contact from "./Contact";
import Footer from "./Footer";

type SectionData = {
  id: string;
  type: string;
  isVisible: boolean;
  data: Record<string, unknown>;
};

const REGISTRY: Record<string, React.ComponentType<{ data: any }>> = {
  nav: Nav,
  hero: Hero,
  stats: Stats,
  marquee: Marquee,
  showreel: Showreel,
  about: About,
  services: Services,
  projects: Projects,
  process: Process,
  testimonials: Testimonials,
  galleryTeaser: GalleryTeaser,
  contact: Contact,
  footer: Footer,
};

export default function SectionRenderer({
  sections,
}: {
  sections: SectionData[];
}) {
  return (
    <>
      {sections
        .filter((s) => s.isVisible)
        .map((s) => {
          const Cmp = REGISTRY[s.type];
          if (!Cmp) return null;
          return <Cmp key={s.id} data={s.data} />;
        })}
    </>
  );
}
