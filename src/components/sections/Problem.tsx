import SectionTitle from "./SectionTitle";

type Card = {
  mockup?: "chart" | "ring" | "grid";
  title?: string;
  desc?: string;
};
type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    sub?: string;
    cards?: Card[];
  };
};

function Mockup({ type }: { type?: string }) {
  if (type === "ring") {
    return (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="30" stroke="var(--border)" strokeWidth="4" />
        <circle
          cx="36"
          cy="36"
          r="30"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeDasharray="188.5"
          strokeDashoffset="150"
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <path d="M31 26v20l16-10z" fill="var(--accent)" />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg width="100" height="56" viewBox="0 0 100 56">
        {Array.from({ length: 7 }).map((_, col) =>
          Array.from({ length: 3 }).map((_, row) => {
            const active = (col + row * 2) % 3 === 0;
            return (
              <rect
                key={`${col}-${row}`}
                x={col * 14}
                y={row * 18}
                width="10"
                height="10"
                rx="2"
                fill={active ? "var(--accent)" : "var(--border)"}
                opacity={active ? 0.9 : 0.6}
              />
            );
          })
        )}
      </svg>
    );
  }
  return (
    <svg width="110" height="56" viewBox="0 0 110 56" fill="none">
      <polyline
        points="0,14 20,20 40,12 58,34 78,40 110,26"
        stroke="var(--accent)"
        strokeWidth="2.5"
        fill="none"
      />
      <circle cx="58" cy="34" r="4" fill="var(--accent)" />
    </svg>
  );
}

export default function Problem({ data }: Props) {
  const cards = data.cards || [];
  return (
    <section id="problem">
      {data.label && <div className="section-label">{data.label}</div>}
      <SectionTitle title={data.title} accentLine={data.titleAccentLine} reveal={false} />
      {data.sub && <p className="problem-sub">{data.sub}</p>}
      <div className="problem-grid">
        {cards.map((c, i) => (
          <div key={i} className="problem-card reveal" data-delay={`${i + 1}`}>
            <div className="problem-mockup">
              <Mockup type={c.mockup} />
            </div>
            {c.title && <div className="problem-title">{c.title}</div>}
            {c.desc && <p className="problem-desc">{c.desc}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
