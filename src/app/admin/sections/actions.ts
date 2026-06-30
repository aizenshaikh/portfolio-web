"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function toggleSectionVisibility(id: string, isVisible: boolean) {
  await requireAdmin();
  await prisma.section.update({ where: { id }, data: { isVisible } });
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function moveSection(id: string, direction: "up" | "down") {
  await requireAdmin();
  const all = await prisma.section.findMany({ orderBy: { order: "asc" } });
  const idx = all.findIndex((s) => s.id === id);
  if (idx < 0) return;
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= all.length) return;
  const a = all[idx];
  const b = all[swap];
  await prisma.$transaction([
    prisma.section.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.section.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function updateBlock(
  sectionId: string,
  key: string,
  value: string
) {
  await requireAdmin();
  // value is JSON string
  try {
    JSON.parse(value);
  } catch {
    throw new Error("Invalid JSON for block " + key);
  }
  await prisma.contentBlock.upsert({
    where: { sectionId_key: { sectionId, key } },
    update: { value },
    create: { sectionId, key, value },
  });
  revalidatePath("/");
  revalidatePath(`/admin/sections/${sectionId}`);
}

export async function updateAllBlocks(
  sectionId: string,
  blocks: { key: string; value: string }[]
) {
  await requireAdmin();
  for (const b of blocks) {
    try {
      JSON.parse(b.value);
    } catch {
      throw new Error(`Invalid JSON in block "${b.key}"`);
    }
  }
  const keys = blocks.map((b) => b.key);
  await prisma.$transaction([
    // Delete blocks that were removed in the editor
    prisma.contentBlock.deleteMany({
      where: { sectionId, key: { notIn: keys } },
    }),
    // Upsert remaining blocks
    ...blocks.map((b) =>
      prisma.contentBlock.upsert({
        where: { sectionId_key: { sectionId, key: b.key } },
        update: { value: b.value },
        create: { sectionId, key: b.key, value: b.value },
      })
    ),
  ]);
  revalidatePath("/");
  revalidatePath(`/admin/sections/${sectionId}`);
}

export async function deleteSection(id: string) {
  await requireAdmin();
  await prisma.section.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function createSection(type: string) {
  await requireAdmin();
  const max = await prisma.section.aggregate({ _max: { order: true } });
  const nextOrder = (max._max.order ?? -1) + 1;
  await prisma.section.create({
    data: { type, order: nextOrder, isVisible: true },
  });
  revalidatePath("/");
  revalidatePath("/admin/sections");
}
