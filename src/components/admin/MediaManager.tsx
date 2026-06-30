"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  url: string;
  alt: string;
  type: string;
};

export default function MediaManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", file.name);
    const res = await fetch("/api/media", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Upload failed");
      return;
    }
    e.target.value = "";
    router.refresh();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this media item? This will remove it from storage and cannot be undone.")) return;
    const res = await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) router.refresh();
  }

  function copy(url: string) {
    navigator.clipboard?.writeText(url);
  }

  return (
    <>
      <div className="admin-card">
        <div className="admin-label">Upload image or video (10 MB max)</div>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={onUpload}
          style={{
            display: "block",
            padding: 8,
            background: "var(--bg)",
            border: "1px dashed var(--border)",
            borderRadius: 8,
            color: "var(--white)",
            fontSize: 13,
            width: "100%",
          }}
        />
        {uploading && <div style={{ marginTop: 8 }}>Uploading…</div>}
        {error && <div className="admin-error">{error}</div>}
      </div>

      <div className="admin-card">
        <div className="admin-label">Library ({items.length})</div>
        <div className="media-grid">
          {items.map((it) => (
            <div key={it.id} className="admin-card" style={{ padding: 8 }}>
              <div className="media-tile">
                {it.type === "video" ? (
                  <video src={it.url} muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.url} alt={it.alt} />
                )}
              </div>
              <div style={{ fontSize: 11, color: "var(--grey)", marginTop: 6, wordBreak: "break-all" }}>
                {it.url}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                <button
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: "4px 10px", fontSize: 11 }}
                  onClick={() => copy(it.url)}
                >
                  Copy URL
                </button>
                <button
                  className="admin-btn admin-btn-danger"
                  style={{ padding: "4px 10px", fontSize: 11 }}
                  onClick={() => onDelete(it.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <div style={{ color: "var(--grey)", fontSize: 13 }}>No media yet.</div>
        )}
      </div>
    </>
  );
}
