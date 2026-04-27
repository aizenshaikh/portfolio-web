import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const themeSchema = z.object({
  colors: z.record(z.string(), z.string()),
  fonts: z.record(z.string(), z.string()),
  spacing: z.record(z.string(), z.string()),
});

export const blockUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const sectionVisibilitySchema = z.object({
  id: z.string(),
  isVisible: z.boolean(),
});

export const sectionReorderSchema = z.object({
  ids: z.array(z.string()),
});

export const mediaSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
  type: z.string().optional(),
});
