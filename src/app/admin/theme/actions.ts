"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { themeSchema } from "@/lib/validations";

export async function updateTheme(input: unknown) {
  await requireAdmin();
  const parsed = themeSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid theme payload");
  }
  const existing = await prisma.themeSettings.findFirst();
  const data = {
    colors: JSON.stringify(parsed.data.colors),
    fonts: JSON.stringify(parsed.data.fonts),
    spacing: JSON.stringify(parsed.data.spacing),
  };
  if (existing) {
    await prisma.themeSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.themeSettings.create({ data });
  }
  revalidatePath("/", "layout");
}
