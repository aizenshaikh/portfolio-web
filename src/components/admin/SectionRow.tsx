"use client";
import Link from "next/link";
import { useTransition } from "react";
import {
  toggleSectionVisibility,
  moveSection,
  deleteSection,
} from "@/app/admin/sections/actions";

type Props = {
  id: string;
  type: string;
  isVisible: boolean;
  order: number;
  isFirst: boolean;
  isLast: boolean;
};

export default function SectionRow({
  id,
  type,
  isVisible,
  order,
  isFirst,
  isLast,
}: Props) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="admin-card">
      <div className="admin-row">
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 20, letterSpacing: "0.05em" }}>
            {type.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: "var(--grey)" }}>
            order {order}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="admin-btn admin-btn-secondary"
            disabled={isFirst || pending}
            onClick={() => startTransition(() => moveSection(id, "up"))}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            className="admin-btn admin-btn-secondary"
            disabled={isLast || pending}
            onClick={() => startTransition(() => moveSection(id, "down"))}
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            className={`admin-toggle${isVisible ? " on" : ""}`}
            onClick={() =>
              startTransition(() => toggleSectionVisibility(id, !isVisible))
            }
            aria-label="Toggle visibility"
          />
          <Link href={`/admin/sections/${id}`} className="admin-btn">
            Edit
          </Link>
          <button
            className="admin-btn admin-btn-danger"
            onClick={() => {
              if (confirm(`Delete section "${type}"?`))
                startTransition(() => deleteSection(id));
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
