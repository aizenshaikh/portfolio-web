"use client";
import { useState, useTransition } from "react";
import { updateTheme } from "@/app/admin/theme/actions";

type Theme = {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
};

export default function ThemeEditor({ theme }: { theme: Theme }) {
  const [colors, setColors] = useState(theme.colors);
  const [fonts, setFonts] = useState(theme.fonts);
  const [spacing, setSpacing] = useState(theme.spacing);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setColor(k: string, v: string) {
    setColors((p) => ({ ...p, [k]: v }));
    setSaved(false);
  }
  function setFont(k: string, v: string) {
    setFonts((p) => ({ ...p, [k]: v }));
    setSaved(false);
  }
  function setSpace(k: string, v: string) {
    setSpacing((p) => ({ ...p, [k]: v }));
    setSaved(false);
  }

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await updateTheme({ colors, fonts, spacing });
        setSaved(true);
      } catch (e: unknown) {
        setError((e as Error).message);
      }
    });
  }

  return (
    <>
      <div className="admin-card">
        <div className="admin-label">Colors</div>
        <div style={{ display: "grid", gap: 12 }}>
          {Object.entries(colors).map(([k, v]) => (
            <div
              key={k}
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            >
              <div style={{ width: 90, fontSize: 13, color: "var(--grey)" }}>{k}</div>
              <div className="color-swatch" style={{ background: v }} />
              <input
                className="admin-input"
                value={v}
                onChange={(e) => setColor(k, e.target.value)}
                style={{ flex: 1 }}
              />
              {/^#[0-9a-fA-F]{6,8}$/.test(v) && (
                <input
                  type="color"
                  value={v.length > 7 ? v.slice(0, 7) : v}
                  onChange={(e) => setColor(k, e.target.value)}
                  style={{ width: 40, height: 40, background: "transparent", border: "none" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-label">Fonts</div>
        {Object.entries(fonts).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "var(--grey)", marginBottom: 4 }}>{k}</div>
            <input
              className="admin-input"
              value={v}
              onChange={(e) => setFont(k, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-label">Spacing</div>
        {Object.entries(spacing).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "var(--grey)", marginBottom: 4 }}>{k}</div>
            <input
              className="admin-input"
              value={v}
              onChange={(e) => setSpace(k, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button className="admin-btn" onClick={save} disabled={pending}>
          {pending ? "Saving…" : "Save theme"}
        </button>
        {saved && <span className="admin-success">Saved. Reload public site to see changes.</span>}
        {error && <span className="admin-error">{error}</span>}
      </div>
    </>
  );
}
