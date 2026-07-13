"use client";
import { useState, useMemo, useEffect } from "react";
import SafeImage from "@/components/SafeImage";
import { parseVideoUrl, resolveThumb } from "@/lib/video";

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
} | null;

export default function GalleryClient({
  page,
  skills,
}: {
  page: PageMeta;
  skills: Skill[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<{ work: Work; skill: Skill } | null>(null);

  const totalAll = useMemo(
    () => skills.reduce((acc, s) => acc + s.works.length + s.emptyCount, 0),
    [skills]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const visibleSkills =
    filter === "all" ? skills : skills.filter((s) => s.key === filter);

  return (
    <>
      <div className="gallery-hero">
        <div className="gallery-hero-grid"></div>
        <div className="gallery-hero-inner">
          <div>
            {page?.eyebrow && (
              <div className="gallery-eyebrow">
                <div className="gallery-eyebrow-dot"></div>
                {page.eyebrow}
              </div>
            )}
            {page && (
              <h1 className="gallery-title">
                <span>{page.titleLine1}</span>
                <span className="outline">{page.titleLine2}</span>
                <span className="gold">{page.titleLine3}</span>
              </h1>
            )}
          </div>
          <div className="gallery-hero-right">
            {page?.description && <p>{page.description}</p>}
            <div className="total-badge">
              <span>Total works:</span>
              <strong>{totalAll}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-inner">
          <button
            type="button"
            className={`filter-btn${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <span className="dot" style={{ background: "var(--accent)" }}></span>
            All Work
            <span className="filter-count">{totalAll}</span>
          </button>
          {skills.map((s) => (
            <button
              type="button"
              key={s.key}
              className={`filter-btn${filter === s.key ? " active" : ""}`}
              onClick={() => setFilter(s.key)}
            >
              <span className="dot" style={{ background: s.color }}></span>
              {s.icon} {s.label}
              <span className="filter-count">{s.works.length + s.emptyCount}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-body">
        {visibleSkills.map((skill) => (
          <section key={skill.key} className="skill-section">
            <div className="skill-header">
              <div className="skill-header-left">
                <div
                  className="skill-icon-badge"
                  style={{
                    background: `${skill.color}18`,
                    borderColor: `${skill.color}33`,
                    color: skill.color,
                  }}
                >
                  {skill.icon}
                </div>
                <div>
                  <div className="skill-title">{skill.label.toUpperCase()}</div>
                </div>
                <span
                  className="skill-count-pill"
                  style={{
                    color: skill.color,
                    borderColor: `${skill.color}44`,
                    background: `${skill.color}10`,
                  }}
                >
                  {skill.works.length + skill.emptyCount} works
                </span>
              </div>
            </div>

            <div className="work-grid">
              {skill.works.map((w) => {
                const video = parseVideoUrl(w.videoUrl);
                const thumb = resolveThumb(w.thumbUrl, w.videoUrl);
                return (
                  <button
                    type="button"
                    key={w.id}
                    className="work-card"
                    onClick={() => setActive({ work: w, skill })}
                  >
                    <div
                      className="card-thumb"
                      style={{
                        background: !thumb
                          ? video.provider === "instagram"
                            ? "linear-gradient(135deg,#833ab4 0%,#fd1d1d 50%,#fcb045 100%)"
                            : video.provider === "tiktok"
                            ? "linear-gradient(135deg,#010101 0%,#69C9D0 100%)"
                            : video.provider === "facebook"
                            ? "#1877F2"
                            : skill.bg
                          : skill.bg,
                      }}
                    >
                      <SafeImage
                        src={thumb}
                        alt={w.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        fallback={
                          <div className="card-thumb-bg-text">
                            {video.provider === "instagram" ? "📸"
                              : video.provider === "tiktok" ? "🎵"
                              : video.provider === "facebook" ? "📘"
                              : skill.icon}
                          </div>
                        }
                      />
                      <span className="card-type-badge" style={{ color: skill.color }}>
                        {w.type}
                      </span>
                      <div className="card-overlay">
                        <div className="card-play">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {video.provider && (
                        <span className="card-video-tag">
                          {{
                            youtube: "YouTube",
                            vimeo: "Vimeo",
                            instagram: "Instagram",
                            facebook: "Facebook",
                            tiktok: "TikTok",
                            dailymotion: "Dailymotion",
                            twitch: "Twitch",
                            loom: "Loom",
                            drive: "Drive",
                            dropbox: "Dropbox",
                            streamable: "Streamable",
                            wistia: "Wistia",
                            direct: "Video",
                          }[video.provider] ?? "Video"}
                        </span>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="card-cat" style={{ color: skill.color }}>
                        {skill.label}
                      </div>
                      <div className="card-title">{w.title}</div>
                      <div className="card-meta">
                        <span>{w.year}</span>
                        {w.result && (
                          <span
                            className="card-result"
                            style={{
                              color: skill.color,
                              background: `${skill.color}15`,
                            }}
                          >
                            {w.result}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {Array.from({ length: skill.emptyCount }).map((_, i) => (
                <div key={`e-${i}`} className="work-card-empty">
                  <div className="empty-thumb">
                    <div
                      className="empty-plus"
                      style={{ borderColor: `${skill.color}33` }}
                    >
                      +
                    </div>
                  </div>
                  <div className="empty-body">
                    <div className="empty-label" style={{ color: skill.color }}>
                      {skill.label} Slot
                    </div>
                    <div className="empty-sublabel">Coming soon</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {page && (
        <div className="back-banner-wrap">
          <div className="back-banner">
            <div>
              <h3>{page.bannerTitle}</h3>
              <p>{page.bannerSub}</p>
            </div>
            {page.bannerHref && (
              <a href={page.bannerHref} className="btn-primary">
                {page.bannerCta}
              </a>
            )}
          </div>
        </div>
      )}

      {active && (
        <Lightbox
          work={active.work}
          skill={active.skill}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}

function Lightbox({
  work,
  skill,
  onClose,
}: {
  work: Work;
  skill: Skill;
  onClose: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const video = parseVideoUrl(work.videoUrl);
  const thumb = resolveThumb(work.thumbUrl, work.videoUrl);
  const isPortrait = video.provider === "instagram" || video.provider === "tiktok";

  return (
    <div
      className="lightbox open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`lightbox-inner${isPortrait ? " lightbox-inner--portrait" : ""}${video.provider === "instagram" ? " lightbox-inner--instagram" : ""}`}>
        <div className="lightbox-thumb" style={{ background: skill.bg }}>
          {playing && video.provider === "instagram" && (
            <div className="lightbox-ig-clip">
              <iframe
                className="lightbox-ig-iframe"
                src={video.embedUrl!}
                title={work.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
              />
            </div>
          )}
          {playing && video.provider !== "instagram" && (video.provider === "youtube" ||
            video.provider === "vimeo" ||
            video.provider === "loom" ||
            video.provider === "streamable" ||
            video.provider === "wistia" ||
            video.provider === "drive" ||
            video.provider === "facebook" ||
            video.provider === "tiktok" ||
            video.provider === "dailymotion" ||
            video.provider === "twitch") && (
            <iframe
              className="lightbox-iframe"
              src={video.embedUrl!}
              title={work.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          )}
          {playing && (video.provider === "direct" || video.provider === "dropbox") && (
            <video
              className="lightbox-iframe"
              src={video.embedUrl!}
              controls
              autoPlay
            />
          )}
          {!playing && (
            <>
              <SafeImage
                src={thumb}
                alt={work.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                fallback={<div className="lightbox-bg-icon">{skill.icon}</div>}
              />
              {video.provider ? (
                <button
                  className="lightbox-play-big"
                  aria-label="Play video"
                  onClick={() => setPlaying(true)}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#000">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              ) : null}
            </>
          )}
        </div>
        <div className="lightbox-body">
          <div className="lightbox-cat" style={{ color: skill.color }}>
            {skill.icon} {skill.label}
          </div>
          <h2 className="lightbox-title">{work.title}</h2>
          {work.desc && <p className="lightbox-desc">{work.desc}</p>}
          <div className="lightbox-results">
            {work.result && (
              <span
                className="lb-result"
                style={{
                  color: skill.color,
                  background: `${skill.color}18`,
                }}
              >
                {work.result}
              </span>
            )}
            <span
              className="lb-result"
              style={{
                color: skill.color,
                background: `${skill.color}18`,
              }}
            >
              {work.type}
            </span>
          </div>
          <div className="lightbox-footer">
            <span className="lb-year">📅 {work.year}</span>
            <button className="lb-close-btn" onClick={onClose}>
              Close ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
