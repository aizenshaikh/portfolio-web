import SectionTitle from "./SectionTitle";
import SafeImage from "@/components/SafeImage";

type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    photoUrl?: string;
    initials?: string;
    badgeBig?: string;
    badgeText?: string;
    paragraphs?: string[];
    skills?: string[];
  };
};

function renderParagraph(p: string, i: number) {
  // basic markdown-style **bold** support
  const parts = p.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={i}>
      {parts.map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className="about-strong">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      })}
    </p>
  );
}

export default function About({ data }: Props) {
  const paragraphs = data.paragraphs || [];
  const skills = data.skills || [];
  return (
    <section id="about">
      <div className="about-grid">
        <div className="about-img-wrap reveal-left">
          <div className="about-img">
            <SafeImage
              src={data.photoUrl}
              alt={data.title || "About"}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              fallback={<div className="about-img-inner">{data.initials}</div>}
            />
            <div className="about-img-overlay"></div>
          </div>
          {(data.badgeBig || data.badgeText) && (
            <div className="about-badge">
              {data.badgeBig && <span className="big">{data.badgeBig}</span>}
              {data.badgeText}
            </div>
          )}
        </div>
        <div className="about-text reveal-right">
          {data.label && <div className="section-label">{data.label}</div>}
          <SectionTitle
            title={data.title}
            accentLine={data.titleAccentLine}
            reveal={false}
          />
          <div className="section-body">{paragraphs.map(renderParagraph)}</div>
          {skills.length > 0 && (
            <div className="skills-list">
              {skills.map((s, i) => (
                <span key={i} className="skill-tag">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
