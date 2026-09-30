import SectionHead from "./SectionHead";

type Card = {
  bgGradient?: string;
  bgLabel?: string;
  category?: string;
  year?: string;
  title?: string;
  desc?: string;
  results?: string[];
};
type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    body?: string;
    cards?: Card[];
  };
};

// "2.4M Views" → big "2.4M", small "Views"; "ROAS 6.8×" → big "6.8×", small "ROAS"
function splitMetric(r: string) {
  const tokens = r.trim().split(/\s+/);
  const idx = tokens.findIndex((t) => /\d/.test(t));
  if (idx === -1) return { big: r, small: "" };
  const big = tokens[idx];
  const small = tokens.filter((_, i) => i !== idx).join(" ");
  return { big, small };
}

export default function Projects({ data }: Props) {
  const cards = data.cards || [];
  return (
    <section id="projects">
      <div className="shell">
        <SectionHead
          label={data.label}
          title={data.title}
          accentLine={data.titleAccentLine}
          body={data.body}
          align="split"
        />
        <div className="projects-stack">
          {cards.map((c, i) => (
            <article
              key={i}
              className="project-card glass glass-strong specular"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div
                className="project-thumb"
                style={c.bgGradient ? { background: c.bgGradient } : undefined}
              >
                {c.bgLabel && (
                  <div className="project-thumb-bg" aria-hidden="true">
                    {c.bgLabel}
                  </div>
                )}
                {c.category && <span className="project-category-badge">{c.category}</span>}
              </div>
              <div className="project-body">
                <div className="project-meta">
                  {c.year && <span>{c.year}</span>}
                </div>
                {c.title && <h3 className="project-title">{c.title}</h3>}
                {c.desc && <p className="project-desc">{c.desc}</p>}
                {c.results && c.results.length > 0 && (
                  <div className="project-results">
                    {c.results.map((r, j) => {
                      const m = splitMetric(r);
                      return (
                        <div key={j} className="project-result">
                          <b>{m.big}</b>
                          {m.small && <small>{m.small}</small>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
