import SectionTitle from "./SectionTitle";

type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    body?: string;
    chips?: string[];
    ctaLabel?: string;
    ctaHref?: string;
  };
};

export default function GalleryTeaser({ data }: Props) {
  const chips = data.chips || [];
  return (
    <section className="gallery-teaser-section">
      <div className="gallery-teaser-card">
        <div>
          {data.label && <div className="section-label reveal">{data.label}</div>}
          <SectionTitle
            title={data.title}
            accentLine={data.titleAccentLine}
            delay={1}
            className="!mb-3"
          />
          {data.body && (
            <p className="section-body reveal" data-delay="2" style={{ maxWidth: 480 }}>
              {data.body}
            </p>
          )}
        </div>
        <div className="gallery-teaser-right reveal" data-delay="3">
          <div className="gallery-chips">
            {chips.map((c, i) => (
              <span key={i} className="gallery-chip">
                {c}
              </span>
            ))}
          </div>
          {data.ctaHref && (
            <a
              href={data.ctaHref}
              className="btn-primary"
              style={{ width: "100%", textAlign: "center" }}
            >
              {data.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
