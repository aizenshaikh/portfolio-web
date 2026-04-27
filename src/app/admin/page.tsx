import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const [sectionCount, mediaCount] = await Promise.all([
    prisma.section.count(),
    prisma.media.count(),
  ]);
  return (
    <div>
      <h2 className="admin-h2">Dashboard</h2>
      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-label">Sections</div>
          <div style={{ fontSize: 36, fontFamily: "var(--font-head)" }}>
            {sectionCount}
          </div>
          <Link href="/admin/sections" className="admin-nav-link">
            Manage →
          </Link>
        </div>
        <div className="admin-card">
          <div className="admin-label">Media</div>
          <div style={{ fontSize: 36, fontFamily: "var(--font-head)" }}>
            {mediaCount}
          </div>
          <Link href="/admin/media" className="admin-nav-link">
            Manage →
          </Link>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-label">Quick actions</div>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <Link href="/admin/sections" className="admin-btn">
            Edit content
          </Link>
          <Link href="/admin/theme" className="admin-btn admin-btn-secondary">
            Edit theme
          </Link>
          <Link href="/admin/media" className="admin-btn admin-btn-secondary">
            Upload media
          </Link>
        </div>
      </div>
    </div>
  );
}
