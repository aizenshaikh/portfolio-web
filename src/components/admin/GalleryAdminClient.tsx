"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import MediaFields from "./MediaFields";
import SafeImage from "@/components/SafeImage";
import { parseVideoUrl, resolveThumb } from "@/lib/video";
import {
  updateGalleryPage,
  updateSkill,
  moveSkill,
  deleteSkill,
  createSkill,
  createWork,
  updateWork,
  deleteWork,
  moveWork,
} from "@/app/admin/gallery/actions";

type Work = {
  id: string;
  title: string;
  type: string;
  result: string;
  year: string;
  desc: string;
  thumbUrl: string;
  videoUrl: string;
};
type Skill = {
  id: string;
  key: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  emptyCount: number;
  isVisible: boolean;
  works: Work[];
};
type PageMeta = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  bannerTitle: string;
  bannerSub: string;
  bannerCta: string;
  bannerHref: string;
};

export default function GalleryAdminClient({
  page,
  skills,
}: {
  page: PageMeta;
  skills: Skill[];
}) {
  return (
    <>
      <PageMetaSection page={page} />
      <NewSkillSection />
      {skills.map((s, i) => (
        <SkillSection
          key={s.id}
          skill={s}
          isFirst={i === 0}
          isLast={i === skills.length - 1}
        />
      ))}
    </>
  );
}

function PageMetaSection({ page }: { page: PageMeta }) {
  const [state, setState] = useState(page);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field<K extends keyof PageMeta>(k: K) {
    return {
      value: state[k],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setState({ ...state, [k]: e.target.value });
        setSaved(false);
      },
    };
  }

  return (
    <details className="admin-card" open>
      <summary style={{ cursor: "pointer", marginBottom: 12 }}>
        <strong>Page header & banner</strong>
      </summary>
      <div className="admin-grid-2">
        <div>
          <label className="admin-label">Eyebrow</label>
          <input className="admin-input" {...field("eyebrow")} />
        </div>
        <div>
          <label className="admin-label">Title Line 1</label>
          <input className="admin-input" {...field("titleLine1")} />
        </div>
        <div>
          <label className="admin-label">Title Line 2 (outline)</label>
          <input className="admin-input" {...field("titleLine2")} />
        </div>
        <div>
          <label className="admin-label">Title Line 3 (gold)</label>
          <input className="admin-input" {...field("titleLine3")} />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <label className="admin-label">Description</label>
        <textarea
          className="admin-input"
          rows={3}
          {...field("description")}
        />
      </div>
      <div className="admin-grid-2" style={{ marginTop: 12 }}>
        <div>
          <label className="admin-label">Banner title</label>
          <input className="admin-input" {...field("bannerTitle")} />
        </div>
        <div>
          <label className="admin-label">Banner sub</label>
          <input className="admin-input" {...field("bannerSub")} />
        </div>
        <div>
          <label className="admin-label">Banner CTA label</label>
          <input className="admin-input" {...field("bannerCta")} />
        </div>
        <div>
          <label className="admin-label">Banner CTA href</label>
          <input className="admin-input" {...field("bannerHref")} />
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="admin-btn"
          disabled={pending}
          onClick={() => {
            setError(null);
            setSaved(false);
            startTransition(async () => {
              try {
                await updateGalleryPage(state);
                setSaved(true);
              } catch (e) {
                setError((e as Error).message);
              }
            });
          }}
        >
          {pending ? "Saving…" : "Save page settings"}
        </button>
        {saved && <span className="admin-success">Saved.</span>}
        {error && <span className="admin-error">{error}</span>}
      </div>
    </details>
  );
}

function NewSkillSection() {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("✨");
  const [color, setColor] = useState("#D6FF3F");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <details className="admin-card">
      <summary style={{ cursor: "pointer", marginBottom: 12 }}>
        <strong>+ Add skill category</strong>
      </summary>
      <div className="admin-grid-2">
        <div>
          <label className="admin-label">Key (slug)</label>
          <input
            className="admin-input"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. photography"
          />
        </div>
        <div>
          <label className="admin-label">Label</label>
          <input
            className="admin-input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <label className="admin-label">Icon (emoji)</label>
          <input
            className="admin-input"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
        </div>
        <div>
          <label className="admin-label">Color</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="color-swatch" style={{ background: color }} />
            <input
              className="admin-input"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: 40, height: 40, background: "transparent", border: "none" }}
            />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="admin-btn"
          disabled={pending || !key || !label}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              try {
                await createSkill({ key, label, icon, color });
                setKey("");
                setLabel("");
              } catch (e) {
                setError((e as Error).message);
              }
            });
          }}
        >
          Add skill
        </button>
        {error && <span className="admin-error">{error}</span>}
      </div>
    </details>
  );
}

function SkillSection({
  skill,
  isFirst,
  isLast,
}: {
  skill: Skill;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [meta, setMeta] = useState({
    label: skill.label,
    icon: skill.icon,
    color: skill.color,
    bg: skill.bg,
    emptyCount: skill.emptyCount,
    isVisible: skill.isVisible,
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showWorks, setShowWorks] = useState(true);
  const [adding, setAdding] = useState(false);

  return (
    <div className="admin-card">
      <div className="admin-row">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${meta.color}20`,
              border: `1px solid ${meta.color}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            {meta.icon}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 18, letterSpacing: "0.05em" }}>
              {meta.label}
            </div>
            <div className="admin-muted">
              {skill.works.length} works · {meta.emptyCount} empty slots
            </div>
          </div>
        </div>
        <div className="admin-flex">
          <button
            className="admin-btn admin-btn-secondary admin-btn-icon"
            disabled={isFirst || pending}
            onClick={() =>
              startTransition(async () => {
                await moveSkill(skill.id, "up");
                router.refresh();
              })
            }
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            className="admin-btn admin-btn-secondary admin-btn-icon"
            disabled={isLast || pending}
            onClick={() =>
              startTransition(async () => {
                await moveSkill(skill.id, "down");
                router.refresh();
              })
            }
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            className={`admin-toggle${meta.isVisible ? " on" : ""}`}
            onClick={() =>
              startTransition(async () => {
                const next = !meta.isVisible;
                setMeta({ ...meta, isVisible: next });
                await updateSkill(skill.id, { ...meta, isVisible: next });
              })
            }
            aria-label="Toggle visibility"
          />
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => setShowWorks((s) => !s)}
          >
            {showWorks ? "Hide" : "Edit"} works
          </button>
          <button
            className="admin-btn admin-btn-danger"
            onClick={() => {
              if (
                confirm(
                  `Delete "${skill.label}" and all its ${skill.works.length} works?`
                )
              ) {
                startTransition(async () => {
                  await deleteSkill(skill.id);
                  router.refresh();
                });
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {showWorks && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div className="admin-grid-2">
            <div>
              <label className="admin-label">Label</label>
              <input
                className="admin-input"
                value={meta.label}
                onChange={(e) => {
                  setMeta({ ...meta, label: e.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div>
              <label className="admin-label">Icon (emoji)</label>
              <input
                className="admin-input"
                value={meta.icon}
                onChange={(e) => {
                  setMeta({ ...meta, icon: e.target.value });
                  setSaved(false);
                }}
              />
            </div>
            <div>
              <label className="admin-label">Color</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="color-swatch" style={{ background: meta.color }} />
                <input
                  className="admin-input"
                  value={meta.color}
                  onChange={(e) => {
                    setMeta({ ...meta, color: e.target.value });
                    setSaved(false);
                  }}
                />
                <input
                  type="color"
                  value={meta.color}
                  onChange={(e) => {
                    setMeta({ ...meta, color: e.target.value });
                    setSaved(false);
                  }}
                  style={{ width: 40, height: 40, background: "transparent", border: "none" }}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Empty placeholder slots</label>
              <input
                type="number"
                className="admin-input"
                min={0}
                value={meta.emptyCount}
                onChange={(e) => {
                  setMeta({ ...meta, emptyCount: parseInt(e.target.value || "0", 10) });
                  setSaved(false);
                }}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="admin-label">Background gradient (CSS)</label>
              <input
                className="admin-input"
                value={meta.bg}
                onChange={(e) => {
                  setMeta({ ...meta, bg: e.target.value });
                  setSaved(false);
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="admin-btn"
              disabled={pending}
              onClick={() => {
                setError(null);
                setSaved(false);
                startTransition(async () => {
                  try {
                    await updateSkill(skill.id, meta);
                    setSaved(true);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                });
              }}
            >
              Save skill
            </button>
            {saved && <span className="admin-success">Saved.</span>}
            {error && <span className="admin-error">{error}</span>}
          </div>

          <h4 className="admin-h3" style={{ marginTop: 20 }}>
            Works ({skill.works.length})
          </h4>
          {skill.works.map((w, i) => (
            <WorkRow
              key={w.id}
              work={w}
              isFirst={i === 0}
              isLast={i === skill.works.length - 1}
            />
          ))}

          {!adding ? (
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setAdding(true)}
            >
              + Add work
            </button>
          ) : (
            <NewWorkRow
              skillId={skill.id}
              onDone={() => setAdding(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function WorkRow({
  work,
  isFirst,
  isLast,
}: {
  work: Work;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [w, setW] = useState(work);
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const video = parseVideoUrl(w.videoUrl);
  const thumb = resolveThumb(w.thumbUrl, w.videoUrl);

  return (
    <div
      className="admin-card"
      style={{ background: "var(--bg3)", marginBottom: 8 }}
    >
      <div className="admin-row">
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 80,
              height: 50,
              borderRadius: 6,
              overflow: "hidden",
              flexShrink: 0,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              position: "relative",
            }}
          >
            <SafeImage
              src={thumb}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              fallback={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: "var(--grey2)",
                  }}
                >
                  {video.provider ? "▶" : "—"}
                </div>
              }
            />
            {video.provider && (
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(0,0,0,0.75)",
                  color: "var(--white)",
                  fontSize: 8,
                  padding: "1px 4px",
                  borderRadius: 3,
                  fontWeight: 700,
                }}
              >
                ▶
              </span>
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {w.title || "(untitled)"}
            </div>
            <div className="admin-muted" style={{ fontSize: 12 }}>
              {[w.type, w.year, w.result].filter(Boolean).join(" · ") || "no metadata"}
            </div>
          </div>
        </div>
        <div className="admin-flex">
          <button
            className="admin-btn admin-btn-secondary admin-btn-icon"
            disabled={isFirst || pending}
            onClick={() =>
              startTransition(async () => {
                await moveWork(work.id, "up");
                router.refresh();
              })
            }
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            className="admin-btn admin-btn-secondary admin-btn-icon"
            disabled={isLast || pending}
            onClick={() =>
              startTransition(async () => {
                await moveWork(work.id, "down");
                router.refresh();
              })
            }
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Edit"}
          </button>
          <button
            className="admin-btn admin-btn-danger"
            onClick={() => {
              if (confirm(`Delete "${w.title}"?`))
                startTransition(async () => {
                  await deleteWork(work.id);
                  router.refresh();
                });
            }}
          >
            ✕
          </button>
        </div>
      </div>
      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <div className="admin-grid-2">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={w.title}
                onChange={(e) => setW({ ...w, title: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Type</label>
              <input
                className="admin-input"
                value={w.type}
                onChange={(e) => setW({ ...w, type: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Year</label>
              <input
                className="admin-input"
                value={w.year}
                onChange={(e) => setW({ ...w, year: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Result</label>
              <input
                className="admin-input"
                value={w.result}
                onChange={(e) => setW({ ...w, result: e.target.value })}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="admin-label">Description</label>
              <textarea
                className="admin-input"
                rows={3}
                value={w.desc}
                onChange={(e) => setW({ ...w, desc: e.target.value })}
              />
            </div>
            <MediaFields
              thumbUrl={w.thumbUrl}
              videoUrl={w.videoUrl}
              onThumbChange={(v) => setW({ ...w, thumbUrl: v })}
              onVideoChange={(v) => setW({ ...w, videoUrl: v })}
            />
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="admin-btn"
              disabled={pending}
              onClick={() => {
                setSaved(false);
                startTransition(async () => {
                  await updateWork(work.id, {
                    title: w.title,
                    type: w.type,
                    result: w.result,
                    year: w.year,
                    desc: w.desc,
                    thumbUrl: w.thumbUrl,
                    videoUrl: w.videoUrl,
                  });
                  router.refresh();
                  setSaved(true);
                });
              }}
            >
              Save
            </button>
            {saved && <span className="admin-success">Saved.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function NewWorkRow({
  skillId,
  onDone,
}: {
  skillId: string;
  onDone: () => void;
}) {
  const router = useRouter();
  const [w, setW] = useState({
    title: "",
    type: "",
    result: "",
    year: "",
    desc: "",
    thumbUrl: "",
    videoUrl: "",
  });
  const [pending, startTransition] = useTransition();

  return (
    <div className="admin-card" style={{ background: "var(--bg3)", marginBottom: 8 }}>
      <div className="admin-grid-2">
        <div>
          <label className="admin-label">Title *</label>
          <input
            className="admin-input"
            value={w.title}
            onChange={(e) => setW({ ...w, title: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Type</label>
          <input
            className="admin-input"
            value={w.type}
            onChange={(e) => setW({ ...w, type: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Year</label>
          <input
            className="admin-input"
            value={w.year}
            onChange={(e) => setW({ ...w, year: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Result</label>
          <input
            className="admin-input"
            value={w.result}
            onChange={(e) => setW({ ...w, result: e.target.value })}
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="admin-label">Description</label>
          <textarea
            className="admin-input"
            rows={3}
            value={w.desc}
            onChange={(e) => setW({ ...w, desc: e.target.value })}
          />
        </div>
        <MediaFields
          thumbUrl={w.thumbUrl}
          videoUrl={w.videoUrl}
          onThumbChange={(v) => setW({ ...w, thumbUrl: v })}
          onVideoChange={(v) => setW({ ...w, videoUrl: v })}
        />
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          className="admin-btn"
          disabled={pending || !w.title}
          onClick={() => {
            startTransition(async () => {
              await createWork(skillId, w);
              router.refresh();
              onDone();
            });
          }}
        >
          Create
        </button>
        <button className="admin-btn admin-btn-secondary" onClick={onDone}>
          Cancel
        </button>
      </div>
    </div>
  );
}
