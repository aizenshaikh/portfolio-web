"use client";
import { useState } from "react";
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
  return (
    <>
      <nav id="site-nav" className="site-nav">
        <a href={resolveHref("#hero")} className="nav-logo">
          {data.logo}
          <span>{data.logoAccent}</span>
        </a>
        <ul className="nav-links">
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
          aria-label="Open menu"
          className="hamburger"
          onClick={() => setOpen(true)}
          style={{ background: "none", border: "none" }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
      <div className={`mobile-menu${open ? " open" : ""}`} aria-hidden={!open}>
        <button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu">
          ✕
        </button>
        {links.map((l) => (
          <a key={l.href} href={resolveHref(l.href)} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        {data.ctaHref && (
          <a href={resolveHref(data.ctaHref)} onClick={() => setOpen(false)}>
            {data.ctaLabel}
          </a>
        )}
      </div>
    </>
  );
}
