import SectionHead from "./SectionHead";

type Card = {
  stars?: number;
  quote?: string;
  avatar?: string;
  name?: string;
  role?: string;
};
type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    cards?: Card[];
  };
};

export default function Testimonials({ data }: Props) {
  const cards = data.cards || [];
  return (
    <section id="testimonials">
      <div className="shell">
        <SectionHead label={data.label} title={data.title} accentLine={data.titleAccentLine} />
        <div className="testimonials-grid">
          {cards.map((c, i) => (
            <figure
              key={i}
              className="testimonial-card glass specular tilt rv"
              data-tilt="3"
              style={{ "--d": i } as React.CSSProperties}
            >
              <div className="testimonial-stars" aria-label={`${c.stars || 5} out of 5 stars`}>
                {Array.from({ length: c.stars || 5 }).map((_, k) => (
                  <span key={k} aria-hidden="true">★</span>
                ))}
              </div>
              {c.quote && <blockquote className="testimonial-quote">“{c.quote}”</blockquote>}
              <figcaption className="testimonial-author">
                <div className="author-avatar" aria-hidden="true">{c.avatar}</div>
                <div>
                  <div className="author-name">{c.name}</div>
                  <div className="author-role">{c.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
