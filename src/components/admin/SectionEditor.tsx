"use client";
import { useState, useTransition } from "react";
import { updateAllBlocks } from "@/app/admin/sections/actions";
import MediaPicker from "./MediaPicker";

type Block = { key: string; value: string };

function pretty(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function SectionEditor({
  sectionId,
  type,
  blocks,
}: {
  sectionId: string;
  type: string;
  blocks: Block[];
}) {
  const [items, setItems] = useState<Block[]>(
    blocks.map((b) => ({ key: b.key, value: pretty(b.value) }))
  );
  const [newKey, setNewKey] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  function update(i: number, value: string) {
    setItems((prev) => prev.map((b, j) => (j === i ? { ...b, value } : b)));
    setSaved(false);
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, j) => j !== i));
  }
  function addBlock() {
    if (!newKey.trim()) return;
    if (items.some((b) => b.key === newKey)) {
      setError(`Key "${newKey}" already exists`);
      return;
    }
    setItems((prev) => [...prev, { key: newKey, value: '""' }]);
    setNewKey("");
    setError(null);
  }

  function save() {
    setError(null);
    setSaved(false);
    // Validate JSON before submitting
    for (const b of items) {
      try {
        JSON.parse(b.value);
      } catch {
        setError(`Invalid JSON in "${b.key}"`);
        return;
      }
    }
    startTransition(async () => {
      try {
        await updateAllBlocks(sectionId, items);
        setSaved(true);
      } catch (e: unknown) {
        setError((e as Error).message || "Save failed");
      }
    });
  }

  return (
    <div>
      <div className="admin-card" style={{ background: "var(--bg3)" }}>
        <div className="admin-label">Section type</div>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 22 }}>{type}</div>
        <div style={{ color: "var(--grey)", fontSize: 13, marginTop: 8 }}>
          Blocks below are key/JSON-value pairs. Edit JSON freely — strings,
          arrays, and objects are all supported.
        </div>
      </div>

      {items.map((b, i) => (
        <div key={b.key} className="admin-card">
          <div className="admin-row" style={{ marginBottom: 8 }}>
            <div className="admin-label" style={{ margin: 0 }}>
              {b.key}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setPickerIndex(i)}
                title="Insert an uploaded image or video URL here"
              >
                📁 Media
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => remove(i)}
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
          <textarea
            className="admin-textarea"
            value={b.value}
            onChange={(e) => update(i, e.target.value)}
            spellCheck={false}
          />
        </div>
      ))}

      <MediaPicker
        open={pickerIndex !== null}
        filter="all"
        onClose={() => setPickerIndex(null)}
        onPick={(url) => {
          if (pickerIndex !== null) update(pickerIndex, JSON.stringify(url));
          setPickerIndex(null);
        }}
      />

      <div className="admin-card">
        <div className="admin-label">Add new block</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="admin-input"
            placeholder="key (e.g. title)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={addBlock}
          >
            Add
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="admin-btn"
          onClick={save}
          disabled={pending}
          type="button"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="admin-success">Saved.</span>}
        {error && <span className="admin-error">{error}</span>}
      </div>
    </div>
  );
}
