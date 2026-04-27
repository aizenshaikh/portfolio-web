"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function updateGalleryPage(input: {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  bannerTitle: string;
  bannerSub: string;
  bannerCta: string;
  bannerHref: string;
}) {
  await requireAdmin();
  const existing = await prisma.galleryPage.findFirst();
  if (existing) {
    await prisma.galleryPage.update({ where: { id: existing.id }, data: input });
  } else {
    await prisma.galleryPage.create({ data: input });
  }
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function updateSkill(
  id: string,
  input: {
    label: string;
    icon: string;
    color: string;
    bg: string;
    emptyCount: number;
    isVisible: boolean;
  }
) {
  await requireAdmin();
  await prisma.gallerySkill.update({ where: { id }, data: input });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function moveSkill(id: string, direction: "up" | "down") {
  await requireAdmin();
  const all = await prisma.gallerySkill.findMany({ orderBy: { order: "asc" } });
  const idx = all.findIndex((s) => s.id === id);
  if (idx < 0) return;
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= all.length) return;
  const a = all[idx];
  const b = all[swap];
  await prisma.$transaction([
    prisma.gallerySkill.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.gallerySkill.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.gallerySkill.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function createSkill(input: {
  key: string;
  label: string;
  icon: string;
  color: string;
}) {
  await requireAdmin();
  if (!input.key.match(/^[a-z0-9-]+$/)) {
    throw new Error("Key must be lowercase letters, digits, and hyphens only");
  }
  const max = await prisma.gallerySkill.aggregate({ _max: { order: true } });
  await prisma.gallerySkill.create({
    data: {
      key: input.key,
      label: input.label,
      icon: input.icon,
      color: input.color,
      bg: `linear-gradient(135deg, ${input.color}30, ${input.color}10)`,
      order: (max._max.order ?? -1) + 1,
      emptyCount: 0,
      isVisible: true,
    },
  });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function createWork(
  skillId: string,
  input: {
    title: string;
    type: string;
    result: string;
    year: string;
    desc: string;
    thumbUrl: string;
    videoUrl: string;
  }
) {
  await requireAdmin();
  const max = await prisma.galleryWork.aggregate({
    where: { skillId },
    _max: { order: true },
  });
  await prisma.galleryWork.create({
    data: {
      skillId,
      title: input.title,
      type: input.type,
      result: input.result,
      year: input.year,
      desc: input.desc,
      thumbUrl: input.thumbUrl,
      videoUrl: input.videoUrl,
      order: (max._max.order ?? -1) + 1,
    },
  });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function updateWork(
  id: string,
  input: {
    title: string;
    type: string;
    result: string;
    year: string;
    desc: string;
    thumbUrl: string;
    videoUrl: string;
  }
) {
  await requireAdmin();
  await prisma.galleryWork.update({ where: { id }, data: input });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteWork(id: string) {
  await requireAdmin();
  await prisma.galleryWork.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function moveWork(id: string, direction: "up" | "down") {
  await requireAdmin();
  const work = await prisma.galleryWork.findUnique({ where: { id } });
  if (!work) return;
  const siblings = await prisma.galleryWork.findMany({
    where: { skillId: work.skillId },
    orderBy: { order: "asc" },
  });
  const idx = siblings.findIndex((s) => s.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= siblings.length) return;
  const a = siblings[idx];
  const b = siblings[swap];
  await prisma.$transaction([
    prisma.galleryWork.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.galleryWork.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
