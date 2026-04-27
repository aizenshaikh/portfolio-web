type Props = {
  title?: string;
  accentLine?: number;
  className?: string;
  delay?: number;
  reveal?: boolean;
};

export default function SectionTitle({
  title,
  accentLine,
  className,
  delay,
  reveal = true,
}: Props) {
  if (!title) return null;
  const lines = title.split("\n");
  const cls = `section-title${reveal ? " reveal" : ""}${className ? " " + className : ""}`;
  return (
    <h2 className={cls} data-delay={delay}>
      {lines.map((line, i) => {
        const isAccent = accentLine ? i === accentLine - 1 : false;
        return (
          <span key={i}>
            {isAccent ? <span className="accent">{line}</span> : line}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </h2>
  );
}
