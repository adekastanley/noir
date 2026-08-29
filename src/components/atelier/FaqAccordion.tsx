import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../data/atelier';
import { Plus, Minus } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="atelier-faq"
      aria-label="Client Services & Frequent Inquiries"
      className="w-full max-w-[1920px] mx-auto bg-background border-b border-border"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 border-l border-border">
        {/* Left Column: Heading */}
        <div className="lg:col-span-4 p-6 sm:p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-border bg-surface-subtle flex flex-col justify-between">
          <div>
            <span className="micro-label text-muted-foreground block mb-2">
              CLIENT SERVICES
            </span>
            <h2 className="editorial-title text-base sm:text-xl font-semibold text-foreground">
              Frequently Inquired
            </h2>
            <p className="text-xs text-muted-foreground font-light mt-3 leading-relaxed">
              Assistance regarding international express logistics, custom dimension guidance, and garment archival maintenance.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border/80 text-[11px] font-mono text-muted-foreground space-y-1">
            <p>Direct Concierge:</p>
            <p className="text-foreground font-semibold">concierge@noir-atelier.com</p>
            <p className="text-[10px] text-muted-foreground">Mon–Fri: 09:00 – 18:00 CET</p>
          </div>
        </div>

        {/* Right Column: Accordion Items */}
        <div className="lg:col-span-8 divide-y divide-border border-r border-border bg-card">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition-colors hover:bg-surface-subtle/50">
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-medium tracking-tight text-foreground">
                    {item.question}
                  </span>
                  <div className="p-1 border border-border text-foreground shrink-0">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs text-muted-foreground font-light leading-relaxed animate-in fade-in duration-150">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
