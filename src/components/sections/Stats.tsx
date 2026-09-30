type StatItem = { count: number; label: string };
type Props = { data: { items?: StatItem[] } };

export default function Stats({ data }: Props) {
  const items = data.items || [];
  return (
    <div id="stats">
      <div className="shell">
        <div className="stats-grid glass glass-strong rv">
          {items.map((it, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number" data-count={it.count} aria-label={`${it.count}+`}>
                {it.count}+
              </div>
              <div className="stat-label">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
