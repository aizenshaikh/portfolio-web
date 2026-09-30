import SectionHead from "./SectionHead";

type Card = {
  icon?: string;
  category?: string;
  name?: string;
  desc?: string;
  list?: string[];
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

export default function Services({ data }: Props) {
  const cards = data.cards || [];
  return (
    <section id="services">
      <div className="shell">
        <SectionHead
          label={data.label}
          title={data.title}
          accentLine={data.titleAccentLine}
          body={data.body}
          align="split"
        />
        <div className={`services-grid n${cards.length}`}>
          {cards.map((c, i) => (
            <article
              key={i}
              className="service-card glass specular tilt rv"
              data-tilt="3"
              style={{ "--d": i % 3 } as React.CSSProperties}
            >
              <div className="service-icon" aria-hidden="true">{c.icon}</div>
              {c.category && <div className="service-category">{c.category}</div>}
              <h3 className="service-name">{c.name}</h3>
              {c.desc && <p className="service-desc">{c.desc}</p>}
              {c.list && (
                <ul className="service-list">
                  {c.list.map((li, j) => (
                    <li key={j}>{li}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
