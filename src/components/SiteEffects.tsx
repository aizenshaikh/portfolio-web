"use client";
import { useEffect } from "react";

export default function SiteEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const preloader = document.getElementById("preloader");
    const t = setTimeout(
      () => preloader?.classList.add("hidden"),
      reduceMotion ? 0 : 1800
    );

    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let mouseX = 0,
      mouseY = 0,
      ringX = 0,
      ringY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
      }
    };
    let raf = 0;
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ring) {
        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    const hoverEls = document.querySelectorAll(
      "a, button, .service-card, .project-card, .btn-primary, .btn-outline"
    );
    const onEnter = () => ring?.classList.add("hover");
    const onLeave = () => ring?.classList.remove("hover");
    if (!reduceMotion) {
      document.addEventListener("mousemove", onMove);
      animate();
      hoverEls.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }

    const onScroll = () => {
      const sp = document.getElementById("scroll-progress");
      const scrolled =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      if (sp) sp.style.width = scrolled + "%";
      const nav = document.getElementById("site-nav");
      nav?.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const revealEls = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));

    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    const animateCount = (el: HTMLElement, target: number) => {
      if (reduceMotion) {
        el.textContent = target + "+";
        return;
      }
      const duration = 1200;
      let start = 0;
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic: settles like a thrown object
        el.textContent = Math.round(eased * target) + "+";
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          animateCount(el, +(el.dataset.count || "0"));
          counterObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObs.observe(c));

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      counterObs.disconnect();
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="preloader">
        <div className="preloader-logo">AMIN</div>
        <div className="preloader-bar-wrap">
          <div className="preloader-bar"></div>
        </div>
      </div>
      <div id="scroll-progress"></div>
      <div className="cursor-dot" id="cursorDot"></div>
      <div className="cursor-ring" id="cursorRing"></div>
    </>
  );
}
