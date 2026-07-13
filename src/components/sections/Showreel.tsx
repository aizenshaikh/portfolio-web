"use client";
import { useState } from "react";
import SectionTitle from "./SectionTitle";
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
    <section id="showreel">
      {data.label && <div className="section-label reveal">{data.label}</div>}
      <SectionTitle
        title={data.title}
        accentLine={data.titleAccentLine}
        delay={1}
      />
      {data.body && (
        <p
          className="section-body reveal"
          data-delay="2"
          style={{ margin: "0 auto", textAlign: "center" }}
        >
          {data.body}
        </p>
      )}
      <div className="showreel-wrap reveal" data-delay="3">
        {playing && video.provider && (
          <>
            {video.provider === "direct" || video.provider === "dropbox" ? (
              <video
                className="lightbox-iframe"
                src={video.embedUrl!}
                controls
                autoPlay
              />
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
                alt="Showreel"
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
              style={{ zIndex: 1 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            {data.playLabel && <p style={{ zIndex: 1 }}>{data.playLabel}</p>}
            {!video.provider && data.videoUrl && (
              <p
                style={{
                  zIndex: 1,
                  fontSize: 11,
                  color: "var(--grey2)",
                  marginTop: 4,
                }}
              >
                (Add a YouTube, Instagram, Facebook, TikTok, or Vimeo link in admin to enable playback)
              </p>
            )}
          </div>
        )}
        <div className="showreel-tag">
          <strong>{data.duration}</strong> &nbsp;· &nbsp;{data.tag}
        </div>
      </div>
    </section>
  );
}
