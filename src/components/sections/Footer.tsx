type Link = { label: string; href: string };
type Props = {
  data: {
    logo?: string;
    logoAccent?: string;
    copy?: string;
    links?: Link[];
  };
};

export default function Footer({ data }: Props) {
  const links = data.links || [];
  return (
    <footer className="site-footer">
      {data.logo && (
        <div className="footer-word" aria-hidden="true">
          {data.logo}
        </div>
      )}
      <div className="shell">
        <div className="footer-inner glass">
          <div className="footer-logo">
            {data.logo}
            <span>{data.logoAccent}</span>
          </div>
          {data.copy && <p className="footer-copy">{data.copy}</p>}
          <nav className="footer-links" aria-label="Footer">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
