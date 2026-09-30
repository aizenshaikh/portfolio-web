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
  const cls = `section-title${reveal ? " rv" : ""}${className ? " " + className : ""}`;
  return (
    <h2 className={cls} style={delay ? ({ "--d": delay } as React.CSSProperties) : undefined}>
      {lines.map((line, i) => {
        const isAccent = accentLine ? i === accentLine - 1 : false;
        return <span key={i}>{isAccent ? <span className="accent">{line}</span> : line}</span>;
      })}
    </h2>
  );
}
