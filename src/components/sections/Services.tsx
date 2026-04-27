import SectionTitle from "./SectionTitle";

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
      <div className="services-header reveal">
        <div>
          {data.label && <div className="section-label">{data.label}</div>}
          <SectionTitle
            title={data.title}
            accentLine={data.titleAccentLine}
            reveal={false}
            className="!mb-0"
          />
        </div>
        {data.body && (
          <p className="section-body" style={{ maxWidth: 360 }}>
            {data.body}
          </p>
        )}
      </div>
      <div className="services-grid">
        {cards.map((c, i) => (
          <div key={i} className="service-card reveal" data-delay={`${i + 1}`}>
            <div className="service-icon">{c.icon}</div>
            {c.category && <div className="service-category">{c.category}</div>}
            <div className="service-name">{c.name}</div>
            {c.desc && <p className="service-desc">{c.desc}</p>}
            {c.list && (
              <ul className="service-list">
                {c.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
