"use client";
import { useState } from "react";
import SectionHead from "./SectionHead";
import SafeImage from "@/components/SafeImage";
import { parseVideoUrl, resolveThumb } from "@/lib/video";

type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    body?: string;
    playLabel?: string;
    duration?: string;
    tag?: string;
    videoUrl?: string;
    thumbUrl?: string;
  };
};

export default function Showreel({ data }: Props) {
  const [playing, setPlaying] = useState(false);
  const video = parseVideoUrl(data.videoUrl);
  const thumb = resolveThumb(data.thumbUrl, data.videoUrl);

  return (
    <section id="showreel" data-p>
      <div className="shell">
        <SectionHead
          label={data.label}
          title={data.title}
          accentLine={data.titleAccentLine}
          body={data.body}
          align="center"
        />
      </div>
      <div style={{ padding: "0 var(--gutter)" }}>
        <div className="showreel-wrap">
          {playing && video.provider && (
            <>
              {video.provider === "direct" || video.provider === "dropbox" ? (
                <video className="lightbox-iframe" src={video.embedUrl!} controls autoPlay playsInline />
              ) : (
                <iframe
                  className="lightbox-iframe"
                  src={video.embedUrl!}
                  title="Showreel"
                  allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              )}
            </>
          )}
          {!playing && (
            <div className="showreel-placeholder">
              {thumb && (
                <SafeImage
                  src={thumb}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                  }}
                  fallback={null}
                />
              )}
              <button
                className="play-btn"
                aria-label="Play showreel"
                onClick={() => video.provider && setPlaying(true)}
                disabled={!video.provider}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              {data.playLabel && <p>{data.playLabel}</p>}
            </div>
          )}
          {!playing && (data.duration || data.tag) && (
            <div className="showreel-tag">
              {data.duration && <strong>{data.duration}</strong>}
              {data.duration && data.tag && <span aria-hidden="true">·</span>}
              {data.tag}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
