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

export default function Hero({ data }: Props) {
  const lines = data.headline || [];
  const fanTiles = data.fanTiles || [];
  return (
    <section id="hero">
      <div className="hero-video-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-content">
        {data.eyebrow && (
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot"></div>
            {data.eyebrow}
          </div>
        )}
        <h1 className="hero-headline">
          {lines.map((l, i) => (
            <span
              key={i}
              className={`line${l.style === "outline" ? " outline" : ""}${
                l.style === "gradient" ? " gradient" : ""
              }`}
            >
              {l.text}
            </span>
          ))}
        </h1>
        {data.sub && <p className="hero-sub">{data.sub}</p>}
        <div className="hero-ctas">
          {data.primaryCta && (
            <a href={data.primaryCta.href} className="btn-primary">
              {data.primaryCta.label}
            </a>
          )}
          {data.secondaryCta && (
            <a href={data.secondaryCta.href} className="btn-outline">
              {data.secondaryCta.label}
            </a>
          )}
        </div>
        {fanTiles.length > 0 && (
          <div className="hero-fan">
            {fanTiles.map((t, i) => (
              <div key={i} className="hero-fan-tile">
                <span>{t.icon}</span>
                <span className="label">{t.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
