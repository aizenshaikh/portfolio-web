"use client";
import { useState } from "react";
import { parseVideoUrl, resolveThumb, detectBadImageUrl } from "@/lib/video";
import SafeImage from "@/components/SafeImage";
import MediaPicker from "./MediaPicker";

type Props = {
  thumbUrl: string;
  videoUrl: string;
  onThumbChange: (v: string) => void;
  onVideoChange: (v: string) => void;
};

const PROVIDER_LABELS: Record<string, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom",
  streamable: "Streamable",
  wistia: "Wistia",
  drive: "Google Drive",
  dropbox: "Dropbox",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  dailymotion: "Dailymotion",
  twitch: "Twitch",
  direct: "Direct video",
};

export default function MediaFields({
  thumbUrl,
  videoUrl,
  onThumbChange,
  onVideoChange,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState<null | "thumb" | "video">(null);

  const video = parseVideoUrl(videoUrl);
  const effectiveThumb = resolveThumb(thumbUrl, videoUrl);
  const badImage = detectBadImageUrl(thumbUrl);

  const isIframe =
    video.provider === "youtube" ||
    video.provider === "vimeo" ||
    video.provider === "loom" ||
    video.provider === "streamable" ||
    video.provider === "wistia" ||
    video.provider === "drive" ||
    video.provider === "instagram" ||
    video.provider === "facebook" ||
    video.provider === "tiktok" ||
    video.provider === "dailymotion" ||
    video.provider === "twitch";

  const isDirectVideo = video.provider === "direct" || video.provider === "dropbox";

  return (
    <>
      <div>
        <label className="admin-label">Video URL</label>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            className="admin-input"
            value={videoUrl}
            onChange={(e) => onVideoChange(e.target.value)}
            placeholder="YouTube, Instagram, Facebook, TikTok, Vimeo, Drive, .mp4 …"
          />
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setPickerOpen("video")}
            title="Pick from library"
            style={{ flexShrink: 0 }}
          >
            📁
          </button>
        </div>
        <div className="admin-muted" style={{ fontSize: 11, marginTop: 4 }}>
          {video.provider ? (
            <span style={{ color: "#4caf50" }}>
              ✓ {PROVIDER_LABELS[video.provider]} detected
              {video.id ? ` · id: ${video.id}` : ""}
            </span>
          ) : videoUrl ? (
            <span style={{ color: "#ff7070" }}>
              ⚠ Not a recognized video URL.
              <br />
              Supported: YouTube, Instagram (post/reel), Facebook, TikTok,
              Dailymotion, Twitch, Vimeo, Loom, Streamable, Wistia, Google
              Drive (file/d/…), Dropbox, or any .mp4/.webm/.mov URL.
            </span>
          ) : (
            <span>
              Paste a YouTube, Instagram, Facebook, TikTok, Vimeo, Drive link,
              or click 📁 to pick from your uploaded library.
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="admin-label">
          Thumbnail URL{" "}
          <span
            style={{
              color: "var(--grey2)",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            — optional
          </span>
        </label>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            className="admin-input"
            value={thumbUrl}
            onChange={(e) => onThumbChange(e.target.value)}
            placeholder={
              video.provider === "youtube"
                ? "(YouTube auto-thumbnail will be used — leave empty)"
                : "/uploads/xxx.jpg or https://..."
            }
          />
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setPickerOpen("thumb")}
            title="Pick from library"
            style={{ flexShrink: 0 }}
          >
            📁
          </button>
        </div>
        <div className="admin-muted" style={{ fontSize: 11, marginTop: 4 }}>
          {badImage ? (
            <span style={{ color: "#ff7070" }}>⚠ {badImage}</span>
          ) : video.provider === "youtube" && !thumbUrl ? (
            <span style={{ color: "#4caf50" }}>
              ✓ YouTube auto-thumbnail will be used.
            </span>
          ) : (
            <>
              Paste a direct image URL, or click 📁 to use an uploaded image.
              Supported shortcuts: Google Drive view links and Dropbox preview links
              are auto-converted.
            </>
          )}
        </div>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <label className="admin-label">
          {video.provider ? "Live video preview" : "Thumbnail preview"}
        </label>
        <div
          style={{
            aspectRatio: "16 / 9",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
            position: "relative",
            maxWidth: 480,
          }}
        >
          {isIframe ? (
            <iframe
              src={video.previewUrl!}
              title="Video preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          ) : isDirectVideo ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={video.previewUrl!}
              controls
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                background: "#000",
              }}
            />
          ) : (
            <SafeImage
              src={effectiveThumb}
              alt="Thumbnail preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                inset: 0,
              }}
              fallback={
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--grey2)",
                    fontSize: 12,
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  {effectiveThumb
                    ? "(image failed to load — check the URL)"
                    : "No thumbnail / video set yet"}
                </div>
              }
            />
          )}
        </div>
        {video.provider && (
          <div className="admin-muted" style={{ fontSize: 11, marginTop: 6 }}>
            ↑ Press play to verify the video. This is exactly what visitors see.
          </div>
        )}
      </div>

      <MediaPicker
        open={pickerOpen !== null}
        filter={pickerOpen === "video" ? "video" : pickerOpen === "thumb" ? "image" : "all"}
        onClose={() => setPickerOpen(null)}
        onPick={(url) => {
          if (pickerOpen === "video") onVideoChange(url);
          else if (pickerOpen === "thumb") onThumbChange(url);
          setPickerOpen(null);
        }}
      />
    </>
  );
}
