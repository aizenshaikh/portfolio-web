type Props = { data: { items?: string[] } };

export default function Marquee({ data }: Props) {
  const items = data.items || [];
  const doubled = [...items, ...items];
  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {doubled.map((t, i) => (
          <span key={i}>
            {t}
            {i < doubled.length - 1 && <span className="marquee-sep">  ✦  </span>}
          </span>
        ))}
      </div>
    </div>
  );
}
