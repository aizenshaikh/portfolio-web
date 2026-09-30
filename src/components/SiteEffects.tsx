"use client";
import { useEffect } from "react";

/**
 * One client-side motion engine for the public pages:
 *  - reveals (.rv → .in) via IntersectionObserver
 *  - scroll-linked progress: [data-p] gets --p for its trip through the
 *    viewport, [data-sticky] gets --p for how far its pinned stage has run
 *  - nav: condensed state, tuck-away on scroll down, scroll-spy lens
 *  - glass: pointer-tracked specular (--mx/--my) + spring-driven tilt
 *  - stat counters that settle like a critically damped spring
 */

// Apple-style spring (damping ratio + response) integrated per frame.
type Spring = { x: number; v: number; target: number };
function stepSpring(s: Spring, dt: number, damping = 1, response = 0.45) {
  const k = Math.pow((2 * Math.PI) / response, 2);
  const c = (4 * Math.PI * damping) / response;
  const a = -k * (s.x - s.target) - c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
}

export default function SiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    /* ---------- Reveals ---------- */
    const revealObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealObs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".rv").forEach((el) => revealObs.observe(el));
    cleanups.push(() => revealObs.disconnect());

    /* ---------- Scroll-linked progress ---------- */
    const pEls = Array.from(document.querySelectorAll<HTMLElement>("[data-p]"));
    const stickyEls = Array.from(document.querySelectorAll<HTMLElement>("[data-sticky]"));
    const nav = document.getElementById("site-nav");
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      if (!reduceMotion) {
        for (const el of pEls) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -vh || r.top > vh * 2) continue;
          const p = (vh - r.top) / (vh + r.height);
          el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
        }
        for (const el of stickyEls) {
          const r = el.getBoundingClientRect();
          const run = r.height - vh;
          if (run <= 0) continue;
          const p = -r.top / run;
          el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
        }
      }
      const y = window.scrollY;
      if (nav) {
        nav.classList.toggle("scrolled", y > 40);
        // Tuck away when reading down, return the moment the user scrolls up.
        const menuOpen = document.body.dataset.menu === "open";
        if (!menuOpen && y > 600 && y - lastY > 6) nav.classList.add("tucked");
        else if (y - lastY < -6 || y < 600) nav.classList.remove("tucked");
      }
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    /* ---------- Nav scroll-spy lens ---------- */
    const linkWrap = document.querySelector<HTMLElement>(".nav-links");
    const lens = document.querySelector<HTMLElement>(".nav-lens");
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-links a"));
    const moveLens = (a: HTMLAnchorElement | null) => {
      if (!lens || !linkWrap) return;
      navLinks.forEach((l) => l.classList.toggle("active", l === a));
      if (!a) {
        lens.style.setProperty("--lo", "0");
        return;
      }
      const wr = linkWrap.getBoundingClientRect();
      const ar = a.getBoundingClientRect();
      lens.style.setProperty("--lx", `${ar.left - wr.left}px`);
      lens.style.setProperty("--lw", `${ar.width}px`);
      lens.style.setProperty("--lo", "1");
    };
    const targets = navLinks
      .map((a) => {
        const hash = a.getAttribute("href")?.split("#")[1];
        const sec = hash ? document.getElementById(hash) : null;
        return sec ? { a, sec } : null;
      })
      .filter(Boolean) as { a: HTMLAnchorElement; sec: HTMLElement }[];
    if (targets.length) {
      const visible = new Map<Element, number>();
      const spy = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
          let best: { a: HTMLAnchorElement; sec: HTMLElement } | null = null;
          let bestRatio = 0;
          for (const t of targets) {
            const r = visible.get(t.sec) || 0;
            if (r > bestRatio) {
              best = t;
              bestRatio = r;
            }
          }
          moveLens(best ? best.a : null);
        },
        { threshold: [0, 0.15, 0.3, 0.5, 0.75], rootMargin: "-35% 0px -45% 0px" }
      );
      targets.forEach((t) => spy.observe(t.sec));
      cleanups.push(() => spy.disconnect());
    }

    /* ---------- Specular highlight + spring tilt on glass ---------- */
    if (finePointer && !reduceMotion) {
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".specular, .tilt"));
      const springs = new Map<HTMLElement, { rx: Spring; ry: Spring; raf: number; last: number }>();
      const run = (el: HTMLElement) => {
        const s = springs.get(el)!;
        const tick = (t: number) => {
          const dt = Math.min(0.032, (t - (s.last || t)) / 1000 || 0.016);
          s.last = t;
          stepSpring(s.rx, dt, 0.8, 0.5);
          stepSpring(s.ry, dt, 0.8, 0.5);
          el.style.setProperty("--rx", `${s.rx.x.toFixed(3)}deg`);
          el.style.setProperty("--ry", `${s.ry.x.toFixed(3)}deg`);
          const settled =
            Math.abs(s.rx.x - s.rx.target) < 0.01 && Math.abs(s.ry.x - s.ry.target) < 0.01 &&
            Math.abs(s.rx.v) < 0.01 && Math.abs(s.ry.v) < 0.01;
          if (settled) {
            s.raf = 0;
            s.last = 0;
          } else s.raf = requestAnimationFrame(tick);
        };
        if (!s.raf) s.raf = requestAnimationFrame(tick);
      };
      for (const el of cards) {
        const isTilt = el.classList.contains("tilt");
        if (isTilt) springs.set(el, { rx: { x: 0, v: 0, target: 0 }, ry: { x: 0, v: 0, target: 0 }, raf: 0, last: 0 });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
          if (isTilt) {
            const s = springs.get(el)!;
            const max = Number(el.dataset.tilt || 5);
            s.rx.target = (0.5 - py) * max;
            s.ry.target = (px - 0.5) * max;
            run(el);
          }
        };
        const onLeave = () => {
          if (!isTilt) return;
          const s = springs.get(el)!;
          s.rx.target = 0;
          s.ry.target = 0;
          run(el);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          const s = springs.get(el);
          if (s?.raf) cancelAnimationFrame(s.raf);
        });
      }
    }

    /* ---------- Counters ---------- */
    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const countObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          countObs.unobserve(el);
          const target = +(el.dataset.count || "0");
          const suffix = el.dataset.suffix ?? "+";
          if (reduceMotion) {
            el.textContent = target + suffix;
            continue;
          }
          const s: Spring = { x: 0, v: 0, target };
          let last = 0;
          const tick = (t: number) => {
            const dt = Math.min(0.032, last ? (t - last) / 1000 : 0.016);
            last = t;
            stepSpring(s, dt, 1, 1.1);
            const done = Math.abs(s.x - target) < 0.4 && Math.abs(s.v) < 0.5;
            el.textContent = (done ? target : Math.round(s.x)) + suffix;
            if (!done) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => {
      if (!reduceMotion) c.textContent = "0" + (c.dataset.suffix ?? "+");
      countObs.observe(c);
    });
    cleanups.push(() => countObs.disconnect());

    root.classList.add("fx-ready");
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="ambient" aria-hidden="true">
      <span className="a1" />
      <span className="a2" />
      <span className="a3" />
    </div>
  );
}
