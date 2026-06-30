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

const DEFAULT_THEME = {
  colors: {
    bg: "#060606",
    bg2: "#0f0f0f",
    bg3: "#1a1a1a",
    accent: "#F5A623",
    accent2: "#FF5C35",
    white: "#F5F0E8",
    grey: "#888888",
    grey2: "#555555",
    border: "rgba(255,255,255,0.06)",
  },
  fonts: {
    head: "'Bebas Neue', sans-serif",
    body: "'Inter', sans-serif",
    sub: "'DM Sans', sans-serif",
  },
  spacing: {
    "section-padding": "100px 5%",
    radius: "12px",
  },
};

export async function getTheme() {
  const t = await prisma.themeSettings.findFirst();
  if (!t) {
    return DEFAULT_THEME;
  }
  const saved = {
    colors: JSON.parse(t.colors) as Record<string, string>,
    fonts: JSON.parse(t.fonts) as Record<string, string>,
    spacing: JSON.parse(t.spacing) as Record<string, string>,
  };
  // Merge defaults so newly added keys appear even for existing themes
  return {
    colors: { ...DEFAULT_THEME.colors, ...saved.colors },
    fonts: { ...DEFAULT_THEME.fonts, ...saved.fonts },
    spacing: { ...DEFAULT_THEME.spacing, ...saved.spacing },
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
