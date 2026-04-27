import { prisma } from "./prisma";
import { blocksToMap } from "@/types/content";

export async function getSections() {
  const sections = await prisma.section.findMany({
    orderBy: { order: "asc" },
    include: { blocks: true },
  });
  return sections.map((s) => ({
    id: s.id,
    type: s.type,
    order: s.order,
    isVisible: s.isVisible,
    data: blocksToMap(s.blocks),
  }));
}

export async function getTheme() {
  const t = await prisma.themeSettings.findFirst();
  if (!t) {
    return {
      colors: {} as Record<string, string>,
      fonts: {} as Record<string, string>,
      spacing: {} as Record<string, string>,
    };
  }
  return {
    colors: JSON.parse(t.colors) as Record<string, string>,
    fonts: JSON.parse(t.fonts) as Record<string, string>,
    spacing: JSON.parse(t.spacing) as Record<string, string>,
  };
}

export function themeToCssVars(theme: {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
}): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(theme.colors)) lines.push(`--${k}: ${v};`);
  for (const [k, v] of Object.entries(theme.fonts)) lines.push(`--font-${k}: ${v};`);
  for (const [k, v] of Object.entries(theme.spacing)) lines.push(`--${k}: ${v};`);
  return `:root{${lines.join("")}}`;
}
