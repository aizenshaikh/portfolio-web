"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

export default function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Login page renders without sidebar
  if (!email || pathname === "/admin/login") {
    return <>{children}</>;
  }

  const links = [
    { href: "/admin", label: "Dashboard", section: "Overview" },
    { href: "/admin/sections", label: "Sections", section: "Content" },
    { href: "/admin/gallery", label: "Gallery", section: "Content" },
    { href: "/admin/theme", label: "Theme", section: "Design" },
    { href: "/admin/media", label: "Media", section: "Design" },
  ];

  // Group by section
  const grouped: Record<string, typeof links> = {};
  for (const l of links) {
    grouped[l.section] = grouped[l.section] || [];
    grouped[l.section].push(l);
  }

  return (
    <div className="admin-shell">
      <div className="admin-mobile-bar">
        <div style={{ fontFamily: "var(--font-head)", letterSpacing: "0.15em" }}>
          AMIN<span style={{ color: "var(--accent)" }}>.</span> CMS
        </div>
        <button
          className="admin-mobile-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰ Menu"}
        </button>
      </div>
      <aside className={`admin-sidebar${open ? " open" : ""}`}>
        <h1>
          AMIN<span style={{ color: "var(--accent)" }}>.</span> CMS
        </h1>
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section}>
            <div className="admin-sidebar-section">{section}</div>
            {items.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/admin" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`admin-nav-link${active ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        ))}
        <div className="admin-sidebar-section" style={{ marginTop: 24 }}>
          Site
        </div>
        <Link href="/" className="admin-nav-link" onClick={() => setOpen(false)}>
          ← View public site
        </Link>
        <Link href="/gallery" className="admin-nav-link" onClick={() => setOpen(false)}>
          ← View gallery
        </Link>

        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--grey)",
              marginBottom: 8,
              wordBreak: "break-all",
            }}
          >
            {email}
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-main-inner">{children}</div>
      </main>
    </div>
  );
}
