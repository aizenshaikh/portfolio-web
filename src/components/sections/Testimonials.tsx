import SectionTitle from "./SectionTitle";

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
      <div className="testimonials-inner">
        {data.label && <div className="section-label reveal">{data.label}</div>}
        <SectionTitle
          title={data.title}
          accentLine={data.titleAccentLine}
          delay={1}
        />
        <div className="testimonials-grid">
          {cards.map((c, i) => (
            <div
              key={i}
              className="testimonial-card reveal"
              data-delay={`${i + 1}`}
            >
              <div className="testimonial-stars">
                {Array.from({ length: c.stars || 5 }).map((_, k) => (
                  <span key={k} className="star">
                    ★
                  </span>
                ))}
              </div>
              {c.quote && <p className="testimonial-quote">{c.quote}</p>}
              <div className="testimonial-author">
                <div className="author-avatar">{c.avatar}</div>
                <div>
                  <div className="author-name">{c.name}</div>
                  <div className="author-role">{c.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
