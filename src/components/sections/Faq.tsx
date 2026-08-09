"use client";
import { useState } from "react";
import SectionTitle from "./SectionTitle";

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

  return (
    <section id="faq">
      <div className="faq-grid">
        <div className="faq-intro">
          {data.label && <div className="section-label">{data.label}</div>}
          <SectionTitle title={data.title} accentLine={data.titleAccentLine} reveal={false} />
          {data.sub && <p className="section-body">{data.sub}</p>}
        </div>
        <div className="faq-list">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} className={`faq-item${open ? " open" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  type="button"
                >
                  {item.q}
                  <span className="faq-toggle">+</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
