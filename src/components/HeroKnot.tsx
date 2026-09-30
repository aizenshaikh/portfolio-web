"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Scroll-scrubbed image sequence (the Apple product-page technique).
 * Frames are a Blender render of an iridescent glass knot, stored in
 * /public/hero/knot/fNNN.webp. The first frame is a plain <img> so the
 * hero paints immediately; the canvas takes over once frames stream in.
 */
const FRAME_COUNT = 96;
const src = (i: number) => `/hero/knot/f${String(i + 1).padStart(3, "0")}.webp`;

export default function HeroKnot() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const stage = wrap.closest<HTMLElement>("[data-sticky]");
    const ctx = canvas.getContext("2d");
    if (!ctx || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // the static first frame is the reduced-motion experience

    // Phones / data-saver: every other frame is plenty at that size.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const step = window.innerWidth < 768 || conn?.saveData ? 2 : 1;
    const indices: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += step) indices.push(i);
    if (indices[indices.length - 1] !== FRAME_COUNT - 1) indices.push(FRAME_COUNT - 1);

    const images: (HTMLImageElement | null)[] = indices.map(() => null);
    let disposed = false;
    let current = -1;
    let shown = 0; // smoothed frame position
    let raf = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * dpr);
      current = -1;
    };

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < images.length; d++) {
        const a = images[i - d];
        if (a) return a;
        const b = images[i + d];
        if (b) return b;
      }
      return null;
    };

    const draw = (i: number) => {
      const img = nearestLoaded(i);
      if (!img) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      current = i;
    };

    const progress = () => {
      const r = stage.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
    };

    // Ease the displayed frame toward the scroll target so fast flicks still
    // read as continuous rotation instead of jumping frames.
    const loop = () => {
      const target = progress() * (images.length - 1);
      shown += (target - shown) * 0.22;
      if (Math.abs(target - shown) < 0.01) shown = target;
      const i = Math.round(shown);
      if (i !== current) draw(i);
      raf = shown === target ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // Load frame 0 first, then stream the rest in order of distance from it.
    const load = (k: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src(indices[k]);
        img.onload = () => {
          if (!disposed) images[k] = img;
          resolve();
        };
        img.onerror = () => resolve();
      });

    size();
    shown = progress() * (indices.length - 1);
    load(0).then(async () => {
      if (disposed) return;
      draw(Math.round(shown));
      setReady(true);
      const rest = indices.map((_, k) => k).slice(1);
      const CONCURRENCY = 6;
      let next = 0;
      const worker = async () => {
        while (!disposed && next < rest.length) {
          const k = rest[next++];
          await load(k);
          if (Math.abs(k - shown) < 3) {
            current = -1;
            kick();
          }
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    });

    const onScroll = () => kick();
    const onResize = () => {
      size();
      kick();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`hero-knot${ready ? " ready" : ""}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src(0)} alt="" fetchPriority="high" />
      <canvas ref={canvasRef} />
    </div>
  );
}
