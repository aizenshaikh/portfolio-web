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
    bg: "#07080a",
    bg2: "#0e1013",
    bg3: "#17191d",
    accent: "#D6FF3F",
    accent2: "#8C5CFF",
    white: "#F5F5F0",
    grey: "#9A9A9A",
    grey2: "#5C5C5C",
    border: "rgba(255,255,255,0.07)",
  },
  fonts: {
    head: "'Bricolage Grotesque', sans-serif",
    body: "'Inter', sans-serif",
    sub: "'Space Grotesk', sans-serif",
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

// Parses #rgb / #rrggbb into "r,g,b" so CSS can do rgba(var(--accent-rgb), alpha).
// Returns null for values that aren't a plain hex color (e.g. existing rgba() strings).
function hexToRgbTuple(hex: string): string | null {
  const m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function themeToCssVars(theme: {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
}): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(theme.colors)) {
    lines.push(`--${k}: ${v};`);
    const rgb = hexToRgbTuple(v);
    if (rgb) lines.push(`--${k}-rgb: ${rgb};`);
  }
  for (const [k, v] of Object.entries(theme.fonts)) lines.push(`--font-${k}: ${v};`);
  for (const [k, v] of Object.entries(theme.spacing)) lines.push(`--${k}: ${v};`);
  return `:root{${lines.join("")}}`;
}
