import SectionTitle from "./SectionTitle";

type Props = {
  label?: string;
  title?: string;
  accentLine?: number;
  body?: string;
  align?: "left" | "center" | "split";
};

/** Label + title + intro, revealed as one staggered group. */
export default function SectionHead({ label, title, accentLine, body, align = "left" }: Props) {
  if (!label && !title && !body) return null;
  const cls = `section-head${align !== "left" ? " " + align : ""}`;
  const titleBlock = (
    <>
      {label && (
        <div className="section-label rv" style={{ "--d": 0 } as React.CSSProperties}>
          {label}
        </div>
      )}
      <SectionTitle title={title} accentLine={accentLine} delay={1} />
    </>
  );
  const bodyBlock = body && (
    <p className="section-body rv" style={{ "--d": 2 } as React.CSSProperties}>
      {body}
    </p>
  );
  if (align === "split") {
    return (
      <div className={cls}>
        <div>{titleBlock}</div>
        {bodyBlock}
      </div>
    );
  }
  return (
    <div className={cls}>
      {titleBlock}
      {bodyBlock}
    </div>
  );
}
