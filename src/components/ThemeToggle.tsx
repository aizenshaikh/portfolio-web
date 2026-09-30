"use client";
import { useEffect, useState } from "react";

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => unknown;
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.getAttribute("data-theme") as "light" | "dark") || "dark");
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    const apply = () => {
      setTheme(next);
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    // Reveal the new appearance from the toggle itself (anchored to its source).
    const doc = document as DocWithVT;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) {
      const r = e.currentTarget.getBoundingClientRect();
      root.style.setProperty("--vx", `${r.left + r.width / 2}px`);
      root.style.setProperty("--vy", `${r.top + r.height / 2}px`);
      doc.startViewTransition(apply);
    } else apply();
  }

  // Avoid rendering the wrong icon before we know the real theme (set in useEffect,
  // which runs after the boot script in <head> has already applied it to <html>).
  if (!theme) {
    return <button className="theme-toggle" aria-label="Toggle theme" />;
  }

  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === "light" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
