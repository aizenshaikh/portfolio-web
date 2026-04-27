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
      <div className="contact-inner">
        {data.label && (
          <div className="section-label reveal" style={{ justifyContent: "center" }}>
            {data.label}
          </div>
        )}
        <h2 className="contact-title reveal" data-delay="1">
          {lines.map((l, i) => {
            const isAccent = accentLine ? i === accentLine - 1 : false;
            return (
              <span key={i}>
                {isAccent ? <span style={{ color: "var(--accent)" }}>{l}</span> : l}
                {i < lines.length - 1 && <br />}
              </span>
            );
          })}
        </h2>
        {data.body && (
          <p className="contact-sub reveal" data-delay="2">
            {data.body}
          </p>
        )}
        <div className="contact-links reveal" data-delay="3">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="contact-link"
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {l.icon && <span className="icon">{l.icon}</span>} {l.label}
            </a>
          ))}
        </div>
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="contact-email-big reveal"
            data-delay="4"
          >
            {data.email}
          </a>
        )}
      </div>
    </section>
  );
}
