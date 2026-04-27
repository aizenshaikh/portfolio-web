"use client";
import { useEffect, useState } from "react";

type MediaItem = {
  id: string;
  url: string;
  alt: string;
  type: string;
};

export default function MediaPicker({
  open,
  onClose,
  onPick,
  filter = "all",
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
  filter?: "all" | "image" | "video";
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetch("/api/media")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load media library.");
        setLoading(false);
      });
  }, [open]);

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
    const d = await res.json();
    if (d.media?.url) {
      onPick(d.media.url);
      onClose();
    }
    e.target.value = "";
  }

  if (!open) return null;

  const visible =
    filter === "all" ? items : items.filter((it) => it.type === filter);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 99500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 880,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, letterSpacing: "0.05em" }}>
              Media library
            </div>
            <div className="admin-muted" style={{ fontSize: 12 }}>
              Click an item to use it. Or upload a new file below.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <label className="admin-btn" style={{ cursor: "pointer" }}>
              {uploading ? "Uploading…" : "⬆ Upload new"}
              <input
                type="file"
                accept={
                  filter === "video"
                    ? "video/*"
                    : filter === "image"
                    ? "image/*"
                    : "image/*,video/*"
                }
                onChange={onUpload}
                disabled={uploading}
                style={{ display: "none" }}
              />
            </label>
            <button className="admin-btn admin-btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
          {error && <div className="admin-error">{error}</div>}
          {loading ? (
            <div className="admin-muted">Loading…</div>
          ) : visible.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: "var(--grey)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <div>
                No {filter === "all" ? "media" : filter + "s"} uploaded yet.
                <br />
                Click <strong>Upload new</strong> above to add your first file.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 12,
              }}
            >
              {visible.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    onPick(it.url);
                    onClose();
                  }}
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      aspectRatio: "1",
                      background: "var(--bg)",
                      position: "relative",
                    }}
                  >
                    {it.type === "video" ? (
                      // eslint-disable-next-line jsx-a11y/media-has-caption
                      <video
                        src={it.url}
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.url}
                        alt={it.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      padding: 8,
                      fontSize: 11,
                      color: "var(--grey)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {it.url.split("/").pop()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
