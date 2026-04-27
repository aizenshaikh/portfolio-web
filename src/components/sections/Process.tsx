import SectionTitle from "./SectionTitle";

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
    <section id="process">
      {data.label && <div className="section-label reveal">{data.label}</div>}
      <SectionTitle
        title={data.title}
        accentLine={data.titleAccentLine}
        delay={1}
      />
      {data.body && (
        <p className="section-body reveal" data-delay="2">
          {data.body}
        </p>
      )}
      <div className="process-steps">
        {steps.map((s, i) => (
          <div key={i} className="process-step reveal" data-delay={`${i + 1}`}>
            <div className="step-number">{s.n}</div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
