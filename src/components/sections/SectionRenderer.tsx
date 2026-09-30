import Nav from "./Nav";
import Hero from "./Hero";
import Stats from "./Stats";
import Marquee from "./Marquee";
import Showreel from "./Showreel";
import About from "./About";
import Problem from "./Problem";
import Services from "./Services";
import Platforms from "./Platforms";
import Projects from "./Projects";
import Process from "./Process";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import GalleryTeaser from "./GalleryTeaser";
import Faq from "./Faq";
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
  problem: Problem,
  services: Services,
  platforms: Platforms,
  projects: Projects,
  process: Process,
  testimonials: Testimonials,
  pricing: Pricing,
  galleryTeaser: GalleryTeaser,
  faq: Faq,
  contact: Contact,
  footer: Footer,
};

export default function SectionRenderer({
  sections,
}: {
  sections: SectionData[];
}) {
  const render = (s: SectionData) => {
    const Cmp = REGISTRY[s.type];
    return Cmp ? <Cmp key={s.id} data={s.data} /> : null;
  };
  const visible = sections.filter((s) => s.isVisible);
  // Landmarks: nav before <main>, footer after it, so the skip link lands on content.
  const chrome = (t: string) => t === "nav" || t === "footer";
  return (
    <>
      {visible.filter((s) => s.type === "nav").map(render)}
      <main id="main">{visible.filter((s) => !chrome(s.type)).map(render)}</main>
      {visible.filter((s) => s.type === "footer").map(render)}
    </>
  );
}
