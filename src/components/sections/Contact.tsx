type Link = { icon?: string; label: string; href: string };
type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    body?: string;
    email?: string;
    links?: Link[];
  };
};

export default function Contact({ data }: Props) {
  const lines = (data.title || "").split("\n");
  const accentLine = data.titleAccentLine;
  const links = data.links || [];
  return (
    <section id="contact">
      <div className="orb" aria-hidden="true" />
      <div className="shell">
        <div className="contact-inner">
          {data.label && <div className="section-label rv">{data.label}</div>}
          <h2 className="contact-title rv" style={{ "--d": 1 } as React.CSSProperties}>
            {lines.map((l, i) => {
              const isAccent = accentLine ? i === accentLine - 1 : false;
              return <span key={i}>{isAccent ? <span className="accent">{l}</span> : l}</span>;
            })}
          </h2>
          {data.body && (
            <p className="contact-sub rv" style={{ "--d": 2 } as React.CSSProperties}>
              {data.body}
            </p>
          )}
          <div className="contact-links rv" style={{ "--d": 3 } as React.CSSProperties}>
            {links.map((l, i) => (
              <a
                key={i}
                href={l.href}
                className="contact-link glass specular"
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {l.icon && <span className="icon" aria-hidden="true">{l.icon}</span>}
                {l.label}
              </a>
            ))}
          </div>
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="contact-email-big rv"
              style={{ "--d": 4 } as React.CSSProperties}
            >
              {data.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
