import SectionTitle from "./SectionTitle";

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

export default function Projects({ data }: Props) {
  const cards = data.cards || [];
  return (
    <section id="projects">
      <div className="projects-header">
        <div>
          {data.label && <div className="section-label reveal">{data.label}</div>}
          <SectionTitle
            title={data.title}
            accentLine={data.titleAccentLine}
            delay={1}
          />
        </div>
        {data.body && (
          <p className="section-body reveal" data-delay="2">
            {data.body}
          </p>
        )}
      </div>
      <div className="projects-grid">
        {cards.map((c, i) => (
          <div key={i} className="project-card reveal" data-delay={`${i + 1}`}>
            <div
              className="project-thumb"
              style={c.bgGradient ? { background: c.bgGradient } : undefined}
            >
              {c.bgLabel && <div className="project-thumb-bg">{c.bgLabel}</div>}
              {c.category && (
                <span className="project-category-badge">{c.category}</span>
              )}
              <div className="project-thumb-overlay">
                <div className="project-play">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="project-body">
              <div className="project-meta">
                {c.year && <span className="project-year">{c.year}</span>}
              </div>
              {c.title && <h3 className="project-title">{c.title}</h3>}
              {c.desc && <p className="project-desc">{c.desc}</p>}
              {c.results && (
                <div className="project-results">
                  {c.results.map((r, j) => (
                    <span key={j} className="project-result">
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
