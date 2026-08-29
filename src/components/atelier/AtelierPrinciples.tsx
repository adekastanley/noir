import React from 'react';
import { ATELIER_PRINCIPLES } from '../../data/atelier';

export const AtelierPrinciples: React.FC = () => {
  return (
    <section
      aria-label="Atelier Philosophy & Craft Principles"
      className="w-full max-w-[1920px] mx-auto bg-background border-b border-border"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 border-l border-border divide-y md:divide-y-0 md:divide-x divide-border">
        {ATELIER_PRINCIPLES.map((principle) => (
          <div
            key={principle.number}
            className="p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 bg-card border-r border-border hover:bg-surface-subtle transition-colors"
          >
            <div>
              <span className="text-2xl sm:text-3xl font-mono text-muted-foreground/40 font-light block mb-4">
                {principle.number}
              </span>
              <span className="micro-label text-muted-foreground block mb-1">
                {principle.subtitle}
              </span>
              <h3 className="editorial-title text-sm sm:text-base font-semibold text-foreground tracking-[0.2em]">
                {principle.title}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
