import HeroKnot from "@/components/HeroKnot";

type HeadlineLine = { text: string; style?: "plain" | "outline" | "gradient" };
type Cta = { label: string; href: string };
type FanTile = { icon?: string; label?: string };
type Props = {
  data: {
    eyebrow?: string;
    headline?: HeadlineLine[];
    sub?: string;
    primaryCta?: Cta;
    secondaryCta?: Cta;
    fanTiles?: FanTile[];
  };
};

// Chips orbit the knot on an ellipse; the offsets are where they land.
function orbit(i: number, n: number) {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.35;
  return {
    x: `${(Math.cos(a) * 34).toFixed(2)}vmin`,
    y: `${(Math.sin(a) * 30).toFixed(2)}vmin`,
  };
}

export default function Hero({ data }: Props) {
  const lines = data.headline || [];
  const fanTiles = data.fanTiles || [];
  return (
    <section id="hero" data-sticky>
      <div className="hero-sticky">
        <div className="hero-glow" aria-hidden="true" />
        <HeroKnot />
        <div className="hero-content">
          {data.eyebrow && (
            <div className="hero-eyebrow glass">
              <span className="dot" aria-hidden="true"></span>
              {data.eyebrow}
            </div>
          )}
          <h1 className="hero-headline">
            {lines.map((l, i) => (
              <span
                key={i}
                className={`line${l.style === "outline" ? " muted" : ""}${
                  l.style === "gradient" ? " gradient" : ""
                }`}
              >
                <span style={{ "--i": i + 1 } as React.CSSProperties}>{l.text}</span>
              </span>
            ))}
          </h1>
          {data.sub && <p className="hero-sub">{data.sub}</p>}
          <div className="hero-ctas">
            {data.primaryCta && (
              <a href={data.primaryCta.href} className="btn-primary">
                {data.primaryCta.label}
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            )}
            {data.secondaryCta && (
              <a href={data.secondaryCta.href} className="btn-outline">
                {data.secondaryCta.label}
              </a>
            )}
          </div>
        </div>
        {fanTiles.length > 0 && (
          <div className="hero-chips">
            {fanTiles.map((t, i) => {
              const o = orbit(i, fanTiles.length);
              return (
                <div
                  key={i}
                  className="hero-chip glass glass-strong"
                  style={{ "--x": o.x, "--y": o.y, "--i": i } as React.CSSProperties}
                >
                  <span className="ico">{t.icon}</span>
                  {t.label}
                </div>
              );
            })}
          </div>
        )}
        <div className="hero-scroll" aria-hidden="true">
          <span className="mouse" />
          Scroll
        </div>
      </div>
    </section>
  );
}
