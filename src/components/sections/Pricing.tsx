import SectionTitle from "./SectionTitle";

type Plan = {
  name?: string;
  desc?: string;
  price?: string;
  unit?: string;
  featured?: boolean;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
};
type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    sub?: string;
    plans?: Plan[];
  };
};

export default function Pricing({ data }: Props) {
  const plans = data.plans || [];
  return (
    <section id="pricing">
      {data.label && <div className="section-label">{data.label}</div>}
      <SectionTitle title={data.title} accentLine={data.titleAccentLine} reveal={false} />
      {data.sub && <p className="pricing-sub">{data.sub}</p>}
      <div className="pricing-grid">
        {plans.map((p, i) => (
          <div
            key={i}
            className={`pricing-card reveal${p.featured ? " featured" : ""}`}
            data-delay={`${i + 1}`}
          >
            {p.featured && <div className="pricing-featured-tag">Most Popular</div>}
            <div className="pricing-name">{p.name}</div>
            {p.desc && <p className="pricing-desc">{p.desc}</p>}
            <div className="pricing-price">
              {p.price}
              {p.unit && (
                <span
                  style={{
                    fontFamily: "var(--font-sub)",
                    fontSize: 13,
                    color: "var(--grey2)",
                    fontWeight: 400,
                    marginLeft: 6,
                  }}
                >
                  {p.unit}
                </span>
              )}
            </div>
            {p.features && (
              <ul className="pricing-features">
                {p.features.map((f, j) => (
                  <li key={j}>
                    <span className="pricing-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {p.ctaHref && (
              <a
                href={p.ctaHref}
                className={p.featured ? "btn-primary" : "btn-outline"}
              >
                {p.ctaLabel || "Get In Touch"}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
