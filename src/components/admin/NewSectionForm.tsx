"use client";
import { useState, useTransition } from "react";
import { createSection } from "@/app/admin/sections/actions";

const TYPES = [
  "nav",
  "hero",
  "stats",
  "marquee",
  "showreel",
  "about",
  "services",
  "projects",
  "process",
  "testimonials",
  "galleryTeaser",
  "contact",
  "footer",
];

export default function NewSectionForm() {
  const [type, setType] = useState("hero");
  const [pending, startTransition] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => createSection(type));
      }}
      style={{ display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap" }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <label className="admin-label">Add section</label>
        <select
          className="admin-input"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <button className="admin-btn" type="submit" disabled={pending}>
        Add
      </button>
    </form>
  );
}
