import { getGalleryData } from "@/lib/gallery";
import GalleryClient from "@/components/gallery/GalleryClient";
import SiteEffects from "@/components/SiteEffects";
import { prisma } from "@/lib/prisma";
import { blocksToMap } from "@/types/content";
import Nav from "@/components/sections/Nav";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { page, skills } = await getGalleryData();

  // Re-use Nav with overridden Gallery link as active
  const navSection = await prisma.section.findFirst({
    where: { type: "nav" },
    include: { blocks: true },
  });
  const navData = navSection ? blocksToMap(navSection.blocks) : {};

  return (
    <>
      <SiteEffects />
      <Nav data={navData} />
      <GalleryClient
        page={
          page
            ? {
                eyebrow: page.eyebrow,
                titleLine1: page.titleLine1,
                titleLine2: page.titleLine2,
                titleLine3: page.titleLine3,
                description: page.description,
                bannerTitle: page.bannerTitle,
                bannerSub: page.bannerSub,
                bannerCta: page.bannerCta,
                bannerHref: page.bannerHref,
              }
            : null
        }
        skills={skills.map((s) => ({
          id: s.id,
          key: s.key,
          label: s.label,
          icon: s.icon,
          color: s.color,
          bg: s.bg,
          emptyCount: s.emptyCount,
          works: s.works.map((w) => ({
            id: w.id,
            title: w.title,
            type: w.type,
            result: w.result,
            year: w.year,
            desc: w.desc,
            thumbUrl: w.thumbUrl,
            videoUrl: w.videoUrl,
          })),
        }))}
      />
    </>
  );
}
