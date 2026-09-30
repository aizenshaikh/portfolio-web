import SectionHead from "./SectionHead";
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

// **bold** segments → <strong>
function splitBold(p: string) {
  return p.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    part.startsWith("**") && part.endsWith("**")
      ? { text: part.slice(2, -2), bold: true }
      : { text: part, bold: false }
  );
}

function renderParagraph(p: string, i: number) {
  return (
    <p key={i}>
      {splitBold(p).map((seg, j) =>
        seg.bold ? (
          <strong key={j} className="about-strong">
            {seg.text}
          </strong>
        ) : (
          <span key={j}>{seg.text}</span>
        )
      )}
    </p>
  );
}

/** The opening paragraph, split into words that light up as it scrolls through. */
function Statement({ text }: { text: string }) {
  const words: { text: string; bold: boolean }[] = [];
  for (const seg of splitBold(text)) {
    for (const w of seg.text.split(/\s+/).filter(Boolean)) words.push({ text: w, bold: seg.bold });
  }
  const n = Math.max(1, words.length - 1);
  return (
    <p className="statement" data-p>
      {words.map((w, i) => {
        const style = { "--w": (i / n).toFixed(3) } as React.CSSProperties;
        return (
          <span key={i}>
            {w.bold ? (
              <strong className="w" style={style}>
                {w.text}
              </strong>
            ) : (
              <span className="w" style={style}>
                {w.text}
              </span>
            )}{" "}
          </span>
        );
      })}
    </p>
  );
}

export default function About({ data }: Props) {
  const paragraphs = data.paragraphs || [];
  const skills = data.skills || [];
  const [lead, ...rest] = paragraphs;
  return (
    <section id="about">
      <div className="shell">
        <SectionHead label={data.label} title={data.title} accentLine={data.titleAccentLine} />
        {lead && <Statement text={lead} />}
        <div className="about-grid">
          <div className="about-img-wrap rv" data-p>
            <div className="about-img">
              <SafeImage
                src={data.photoUrl}
                alt={data.title?.replace(/\n/g, " ") || "About"}
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
              <div className="about-badge glass glass-strong">
                {data.badgeBig && <span className="big">{data.badgeBig}</span>}
                {data.badgeText}
              </div>
            )}
          </div>
          <div className="about-text">
            {rest.length > 0 && (
              <div className="section-body rv" style={{ "--d": 1 } as React.CSSProperties}>
                {rest.map(renderParagraph)}
              </div>
            )}
            {skills.length > 0 && (
              <div className="skills-list rv" style={{ "--d": 2 } as React.CSSProperties}>
                {skills.map((s, i) => (
                  <span key={i} className="skill-tag glass">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
