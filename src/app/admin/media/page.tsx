import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import MediaManager from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdmin();
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h2 className="admin-h2">Media library</h2>
      <div
        className="admin-card"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,166,35,0.07), rgba(255,92,53,0.05))",
          borderColor: "rgba(245,166,35,0.18)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>
          What is this for?
        </div>
        <div style={{ fontSize: 13, color: "var(--grey)", lineHeight: 1.6 }}>
          Upload your own image and video files here. Each upload is saved to
          <code
            style={{
              background: "var(--bg3)",
              padding: "2px 6px",
              borderRadius: 4,
              margin: "0 4px",
              fontSize: 12,
            }}
          >
            /uploads/&hellip;
          </code>
          on this server and gets a permanent URL.
          <br />
          Once uploaded, you can:
          <ul style={{ margin: "6px 0 0 18px" }}>
            <li>
              In Gallery / Sections, click the 📁 button next to any URL field to
              pick from this library directly.
            </li>
            <li>
              Or click <strong>Copy URL</strong> below and paste it into any
              thumbnail / video field.
            </li>
          </ul>
          <div style={{ marginTop: 8, color: "var(--grey2)" }}>
            For external videos (YouTube, Vimeo, Loom, etc.) you don&apos;t need to
            upload anything — paste the link directly into the work&apos;s Video URL
            field.
          </div>
        </div>
      </div>
      <MediaManager items={items} />
    </div>
  );
}
