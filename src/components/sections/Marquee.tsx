type Props = { data: { items?: string[] } };

export default function Marquee({ data }: Props) {
  const items = data.items || [];
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div className="marquee-strip" aria-label={items.join(", ")}>
      <div className="marquee-inner" aria-hidden="true">
        {doubled.map((t, i) => (
          <span key={i}>
            {t}
            <span className="marquee-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
