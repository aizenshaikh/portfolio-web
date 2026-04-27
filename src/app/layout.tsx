import type { Metadata } from "next";
import "./globals.css";
import { getTheme, themeToCssVars } from "@/lib/content";

export const metadata: Metadata = {
  title: "Amin Shaikh — Visual Storyteller & Creative Director",
  description:
    "Award-level video editor, motion designer & creative strategist. I turn raw footage into high-converting visual stories.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  const css = themeToCssVars(theme);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
