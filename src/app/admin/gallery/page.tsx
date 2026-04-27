import { requireAdmin } from "@/lib/session";
import { getAllGalleryDataForAdmin } from "@/lib/gallery";
import GalleryAdminClient from "@/components/admin/GalleryAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdmin();
  const { page, skills } = await getAllGalleryDataForAdmin();
  return (
    <div>
      <h2 className="admin-h2">Gallery</h2>
      <GalleryAdminClient
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
            : {
                eyebrow: "",
                titleLine1: "",
                titleLine2: "",
                titleLine3: "",
                description: "",
                bannerTitle: "",
                bannerSub: "",
                bannerCta: "",
                bannerHref: "",
              }
        }
        skills={skills.map((s) => ({
          id: s.id,
          key: s.key,
          label: s.label,
          icon: s.icon,
          color: s.color,
          bg: s.bg,
          emptyCount: s.emptyCount,
          isVisible: s.isVisible,
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
    </div>
  );
}
