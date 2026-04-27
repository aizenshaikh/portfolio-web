import { prisma } from "./prisma";

export async function getGalleryData() {
  const [page, skills] = await Promise.all([
    prisma.galleryPage.findFirst(),
    prisma.gallerySkill.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      include: { works: { orderBy: { order: "asc" } } },
    }),
  ]);
  return { page, skills };
}

export async function getAllGalleryDataForAdmin() {
  const [page, skills] = await Promise.all([
    prisma.galleryPage.findFirst(),
    prisma.gallerySkill.findMany({
      orderBy: { order: "asc" },
      include: { works: { orderBy: { order: "asc" } } },
    }),
  ]);
  return { page, skills };
}
