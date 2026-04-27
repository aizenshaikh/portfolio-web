export type VideoProvider =
  | "youtube"
  | "vimeo"
  | "loom"
  | "streamable"
  | "wistia"
  | "drive"
  | "dropbox"
  | "direct"
  | null;

export type VideoInfo = {
  provider: VideoProvider;
  id: string | null;
  embedUrl: string | null;
  previewUrl: string | null;
  thumbUrl: string | null;
};

const empty: VideoInfo = {
  provider: null,
  id: null,
  embedUrl: null,
  previewUrl: null,
  thumbUrl: null,
};

export function parseVideoUrl(url: string | null | undefined): VideoInfo {
  if (!url) return empty;
  const u = url.trim();
  if (!u) return empty;

  // ── YouTube ──────────────────────────────────────────────────────
  // Forms: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID,
  //        youtube.com/shorts/ID, youtube.com/live/ID, youtube.com/v/ID,
  //        m.youtube.com, music.youtube.com, with extra query params.
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (yt) {
    const id = yt[1];
    return {
      provider: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      previewUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`,
      thumbUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // ── Vimeo ────────────────────────────────────────────────────────
  // vimeo.com/123, vimeo.com/video/123, player.vimeo.com/video/123
  const v = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (v) {
    const id = v[1];
    return {
      provider: "vimeo",
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      previewUrl: `https://player.vimeo.com/video/${id}`,
      thumbUrl: null,
    };
  }

  // ── Loom ─────────────────────────────────────────────────────────
  // loom.com/share/ID, loom.com/embed/ID
  const loom = u.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loom) {
    const id = loom[1];
    return {
      provider: "loom",
      id,
      embedUrl: `https://www.loom.com/embed/${id}`,
      previewUrl: `https://www.loom.com/embed/${id}`,
      thumbUrl: null,
    };
  }

  // ── Streamable ───────────────────────────────────────────────────
  // streamable.com/abc, streamable.com/e/abc
  const stream = u.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/);
  if (stream) {
    const id = stream[1];
    return {
      provider: "streamable",
      id,
      embedUrl: `https://streamable.com/e/${id}`,
      previewUrl: `https://streamable.com/e/${id}`,
      thumbUrl: null,
    };
  }

  // ── Wistia ───────────────────────────────────────────────────────
  // wistia.com/medias/ID, fast.wistia.net/embed/iframe/ID
  const wistia = u.match(/wistia\.(?:com|net)\/(?:medias|embed\/iframe)\/([a-zA-Z0-9]+)/);
  if (wistia) {
    const id = wistia[1];
    return {
      provider: "wistia",
      id,
      embedUrl: `https://fast.wistia.net/embed/iframe/${id}?autoPlay=true`,
      previewUrl: `https://fast.wistia.net/embed/iframe/${id}`,
      thumbUrl: null,
    };
  }

  // ── Google Drive ─────────────────────────────────────────────────
  // drive.google.com/file/d/ID/view → preview URL
  const drive = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (drive) {
    const id = drive[1];
    // If the URL looks like an image, treat as image (caller decides).
    // Otherwise serve the iframe preview which works for video files too.
    return {
      provider: "drive",
      id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      previewUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumbUrl: null,
    };
  }

  // ── Dropbox ──────────────────────────────────────────────────────
  // dropbox.com/s/.../file.mp4?dl=0  → ?raw=1 for direct
  if (/dropbox\.com\/(?:s|scl)\//i.test(u)) {
    if (/\.(mp4|webm|mov|m4v|ogg|ogv|mkv)(\?|$)/i.test(u)) {
      const direct = u
        .replace(/[?&]dl=0/, "")
        .replace(/[?&]dl=1/, "")
        .replace(/[?&]raw=1/, "");
      const sep = direct.includes("?") ? "&" : "?";
      const out = `${direct}${sep}raw=1`;
      return {
        provider: "dropbox",
        id: null,
        embedUrl: out,
        previewUrl: out,
        thumbUrl: null,
      };
    }
  }

  // ── Direct video file ────────────────────────────────────────────
  if (/\.(mp4|webm|mov|m4v|ogg|ogv|mkv)(\?|$)/i.test(u)) {
    return {
      provider: "direct",
      id: null,
      embedUrl: u,
      previewUrl: u,
      thumbUrl: null,
    };
  }

  return empty;
}

/**
 * Normalize an image URL pasted from common platforms so the <img> tag can
 * actually load it. Specifically rewrites Google Drive view URLs and Dropbox
 * preview URLs to direct-content URLs.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  const u = url.trim();
  if (!u) return "";

  // Google Drive image: drive.google.com/file/d/ID/view → uc?export=view&id=ID
  const drive = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (drive) {
    return `https://drive.google.com/uc?export=view&id=${drive[1]}`;
  }
  // Drive thumbnail/uc URL passes through
  if (/drive\.google\.com\/(?:uc|thumbnail)\?/.test(u)) return u;

  // Dropbox image: dropbox.com/s/... → add ?raw=1
  if (/dropbox\.com\/(?:s|scl)\//i.test(u)) {
    const cleaned = u
      .replace(/[?&]dl=0/, "")
      .replace(/[?&]dl=1/, "")
      .replace(/[?&]raw=1/, "");
    const sep = cleaned.includes("?") ? "&" : "?";
    return `${cleaned}${sep}raw=1`;
  }

  return u;
}

export function resolveThumb(
  thumbUrl: string | null | undefined,
  videoUrl: string | null | undefined
): string | null {
  const t = (thumbUrl || "").trim();
  if (t) return normalizeImageUrl(t);
  const v = parseVideoUrl(videoUrl);
  return v.thumbUrl;
}

/** Detects URLs that almost certainly won't work as `<img src>`. */
export function detectBadImageUrl(url: string): string | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;
  if (/^https?:\/\/(www\.)?google\.com\/(imgres|search)/i.test(u)) {
    return "This is a Google Search page URL, not an image URL. Right-click the image → 'Copy image address'.";
  }
  if (/^https?:\/\/(www\.)?bing\.com\/images\/search/i.test(u)) {
    return "This is a Bing Search page URL, not an image URL.";
  }
  if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/i.test(u)) {
    return "This is a video URL — paste it in the Video URL field above instead.";
  }
  return null;
}
