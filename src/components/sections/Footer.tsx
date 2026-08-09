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
    <footer className="site-footer" data-word={data.logo || ""}>
      <div className="footer-inner">
        <div className="footer-logo">
          {data.logo}
          <span>{data.logoAccent}</span>
        </div>
        {data.copy && <p className="footer-copy">{data.copy}</p>}
        <div className="footer-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
