import React from 'react';
import { useCMSContent } from '../../api/queries';
import { Skeleton } from '../ui/skeleton';

export const AtelierPrinciples: React.FC = () => {
  const { data: principlesResponse, isLoading } = useCMSContent('atelier-principles');
  const principlesData = principlesResponse?.data || principlesResponse?.fields || principlesResponse || {};
  const principlesList = Array.isArray(principlesData.principles_list) ? principlesData.principles_list : [];

  if (isLoading) {
    return (
      <section className="w-full max-w-[1920px] mx-auto bg-background border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-border divide-y md:divide-y-0 md:divide-x divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 sm:p-8 md:p-10 bg-card border-r border-border h-64">
              <Skeleton className="w-12 h-8 mb-4" />
              <Skeleton className="w-32 h-4 mb-2" />
              <Skeleton className="w-48 h-6 mb-6" />
              <Skeleton className="w-full h-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (principlesList.length === 0) return null;

  return (
    <section
      aria-label="Atelier Philosophy & Craft Principles"
      className="w-full max-w-[1920px] mx-auto bg-background border-b border-border"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 border-l border-border divide-y md:divide-y-0 md:divide-x divide-border">
        {principlesList.map((principle: any, idx: number) => (
          <div
            key={idx}
            className="p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 bg-card border-r border-border hover:bg-surface-subtle transition-colors"
          >
            <div>
              <span className="text-2xl sm:text-3xl font-mono text-muted-foreground/40 font-light block mb-4">
                0{idx + 1}
              </span>
              <span className="micro-label text-muted-foreground block mb-1">
                CORE PRINCIPLE
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
