import SectionHead from "./SectionHead";

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

// Small illustrative graphics; strokes marked .draw animate in when revealed.
function Mockup({ type }: { type?: string }) {
  if (type === "ring") {
    return (
      <svg width="84" height="84" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="30" stroke="var(--hairline)" strokeWidth="5" />
        <circle
          className="draw"
          cx="36"
          cy="36"
          r="30"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ "--len": 188.5, "--end": 150 } as React.CSSProperties}
        />
        <path d="M31 26v20l16-10z" fill="var(--accent)" />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg width="120" height="66" viewBox="0 0 100 56" aria-hidden="true">
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
                rx="3"
                fill={active ? "var(--accent)" : "var(--hairline)"}
                opacity={active ? 0.95 : 1}
              />
            );
          })
        )}
      </svg>
    );
  }
  return (
    <svg width="140" height="70" viewBox="0 0 110 56" fill="none" aria-hidden="true">
      <polyline
        className="draw"
        points="0,14 20,20 40,12 58,34 78,40 110,26"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ "--len": 150 } as React.CSSProperties}
      />
      <circle cx="58" cy="34" r="4.5" fill="var(--accent)" />
    </svg>
  );
}

export default function Problem({ data }: Props) {
  const cards = data.cards || [];
  return (
    <section id="problem">
      <div className="shell">
        <SectionHead
          label={data.label}
          title={data.title}
          accentLine={data.titleAccentLine}
          body={data.sub}
          align="center"
        />
        <div className="problem-grid">
          {cards.map((c, i) => (
            <article
              key={i}
              className="problem-card glass specular rv"
              style={{ "--d": i } as React.CSSProperties}
            >
              <div className="problem-mockup">
                <Mockup type={c.mockup} />
              </div>
              {c.title && <h3 className="problem-title">{c.title}</h3>}
              {c.desc && <p className="problem-desc">{c.desc}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
