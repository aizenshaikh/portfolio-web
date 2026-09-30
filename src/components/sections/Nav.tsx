"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

type NavLink = { label: string; href: string };
type Props = {
  data: {
    logo?: string;
    logoAccent?: string;
    links?: NavLink[];
    ctaLabel?: string;
    ctaHref?: string;
  };
};

export default function Nav({ data }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const resolveHref = (href: string) =>
    href.startsWith("#") && !isHome ? `/${href}` : href;
  const links = data.links || [];

  // Let the scroll engine know not to tuck the bar away while the sheet is open,
  // and close on Escape.
  useEffect(() => {
    document.body.dataset.menu = open ? "open" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav id="site-nav" className="site-nav" aria-label="Primary">
        <a href={resolveHref("#hero")} className="nav-logo">
          {data.logo}
          <span>{data.logoAccent}</span>
        </a>
        <ul className="nav-links">
          <li className="nav-lens" aria-hidden="true" role="presentation" />
          {links.map((l) => (
            <li key={l.href}>
              <a href={resolveHref(l.href)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
        {data.ctaHref && (
          <a href={resolveHref(data.ctaHref)} className="nav-cta">
            {data.ctaLabel}
          </a>
        )}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="hamburger"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="bars">
            <span></span>
            <span></span>
          </span>
        </button>
      </nav>
      <div
        className={`mobile-scrim${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        className={`mobile-menu glass glass-strong${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={resolveHref(l.href)}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {l.label}
            <span className="chev" aria-hidden="true">›</span>
          </a>
        ))}
        {data.ctaHref && (
          <a
            href={resolveHref(data.ctaHref)}
            className="mobile-cta"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {data.ctaLabel}
          </a>
        )}
      </div>
    </>
  );
}
