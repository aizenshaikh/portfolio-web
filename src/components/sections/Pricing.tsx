import SectionHead from "./SectionHead";

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
      <div className="shell">
        <SectionHead
          label={data.label}
          title={data.title}
          accentLine={data.titleAccentLine}
          body={data.sub}
          align="center"
        />
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <article
              key={i}
              className={`pricing-card glass specular tilt rv${p.featured ? " featured" : ""}`}
              data-tilt="3"
              style={{ "--d": i } as React.CSSProperties}
            >
              {p.featured && <div className="pricing-featured-tag">Most Popular</div>}
              <h3 className="pricing-name">{p.name}</h3>
              {p.desc && <p className="pricing-desc">{p.desc}</p>}
              <div className="pricing-price">
                {p.price}
                {p.unit && <span className="unit">{p.unit}</span>}
              </div>
              {p.features && (
                <ul className="pricing-features">
                  {p.features.map((f, j) => (
                    <li key={j}>
                      <span className="pricing-check" aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {p.ctaHref && (
                <a href={p.ctaHref} className={p.featured ? "btn-primary" : "btn-outline"}>
                  {p.ctaLabel || "Get In Touch"}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
