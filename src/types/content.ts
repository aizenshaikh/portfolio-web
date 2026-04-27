export type SectionType =
  | "nav"
  | "hero"
  | "stats"
  | "marquee"
  | "showreel"
  | "about"
  | "services"
  | "projects"
  | "process"
  | "testimonials"
  | "galleryTeaser"
  | "contact"
  | "footer";

export interface ThemeColors {
  bg: string;
  bg2: string;
  bg3: string;
  accent: string;
  accent2: string;
  white: string;
  grey: string;
  grey2: string;
  border: string;
}

export interface ThemeFonts {
  head: string;
  body: string;
  sub: string;
}

export interface ThemeSpacing {
  sectionPadding: string;
  radius: string;
}

export interface SectionWithBlocks {
  id: string;
  type: string;
  order: number;
  isVisible: boolean;
  blocks: { key: string; value: string }[];
}

export type BlockMap = Record<string, unknown>;

export function blocksToMap(
  blocks: { key: string; value: string }[]
): BlockMap {
  const map: BlockMap = {};
  for (const b of blocks) {
    try {
      map[b.key] = JSON.parse(b.value);
    } catch {
      map[b.key] = b.value;
    }
  }
  return map;
}
