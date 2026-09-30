import SectionHead from "./SectionHead";

type Step = { n: string; title: string; desc: string };
type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    body?: string;
    steps?: Step[];
  };
};

export default function Process({ data }: Props) {
  const steps = data.steps || [];
  return (
    <section id="process" data-p>
      <div className="shell">
        <SectionHead label={data.label} title={data.title} accentLine={data.titleAccentLine} body={data.body} />
        <ol className="process-steps">
          <li className="process-rail" aria-hidden="true" role="presentation" />
          {steps.map((s, i) => (
            <li
              key={i}
              className="process-step glass specular rv"
              style={{ "--d": i % 2 } as React.CSSProperties}
            >
              <div className="step-number">{s.n}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
