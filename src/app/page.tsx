import { getSections } from "@/lib/content";
import SectionRenderer from "@/components/sections/SectionRenderer";
import SiteEffects from "@/components/SiteEffects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sections = await getSections();
  return (
    <>
      <SiteEffects />
      <SectionRenderer sections={sections} />
    </>
  );
}
