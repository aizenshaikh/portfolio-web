import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getTheme, themeToCssVars } from "@/lib/content";

export const metadata: Metadata = {
  title: "Amin Shaikh — Graphic Designer & Visual Storyteller",
  description:
    "Graphic designer, motion designer & creative director. I build bold visual identities and turn ideas into brands people remember.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#07080a" },
  ],
};

// Runs before paint: pick the saved appearance, else follow the system, and
// flag that JS is available so reveal styles only apply when they can finish.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}d.setAttribute('data-theme',t);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  const css = themeToCssVars(theme);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
