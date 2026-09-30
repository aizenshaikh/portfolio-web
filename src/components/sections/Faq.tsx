"use client";
import { useId, useState } from "react";
import SectionHead from "./SectionHead";

type Item = { q?: string; a?: string };
type Props = {
  data: {
    label?: string;
    title?: string;
    titleAccentLine?: number;
    sub?: string;
    items?: Item[];
  };
};

export default function Faq({ data }: Props) {
  const items = data.items || [];
  const [openIndex, setOpenIndex] = useState(0);
  const uid = useId();

  return (
    <section id="faq">
      <div className="shell">
        <div className="faq-grid">
          <div className="faq-intro">
            <SectionHead label={data.label} title={data.title} accentLine={data.titleAccentLine} body={data.sub} />
          </div>
          <div className="faq-list">
            {items.map((item, i) => {
              const open = openIndex === i;
              const panelId = `${uid}-a${i}`;
              return (
                <div
                  key={i}
                  className={`faq-item glass rv${open ? " open" : ""}`}
                  style={{ "--d": i % 4 } as React.CSSProperties}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    type="button"
                  >
                    {item.q}
                    <span className="faq-toggle" aria-hidden="true">+</span>
                  </button>
                  <div className="faq-answer" id={panelId} role="region">
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
