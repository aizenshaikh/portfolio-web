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
      <div className="shell">
        <div className="gallery-teaser-card glass glass-strong specular rv rv-scale">
          <div className="orb" aria-hidden="true" />
          <div>
            {data.label && <div className="section-label">{data.label}</div>}
            <SectionTitle title={data.title} accentLine={data.titleAccentLine} reveal={false} />
            {data.body && <p className="section-body">{data.body}</p>}
          </div>
          <div className="gallery-teaser-right">
            <div className="gallery-chips">
              {chips.map((c, i) => (
                <span key={i} className="gallery-chip">
                  {c}
                </span>
              ))}
            </div>
            {data.ctaHref && (
              <a href={data.ctaHref} className="btn-primary" style={{ width: "100%" }}>
                {data.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
