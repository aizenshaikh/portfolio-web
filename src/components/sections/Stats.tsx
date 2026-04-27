type StatItem = { count: number; label: string };
type Props = { data: { items?: StatItem[] } };

export default function Stats({ data }: Props) {
  const items = data.items || [];
  return (
    <div id="stats">
      <div className="stats-grid">
        {items.map((it, i) => (
          <div key={i} className="stat-item reveal" data-delay={`${i + 1}`}>
            <div className="stat-number" data-count={it.count}>
              0
            </div>
            <div className="stat-label">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
