import React from 'react';
import { MATERIAL_STUDIES } from '../../data/atelier';
import { ImageWithFallback } from '../ui/ImagePlaceholder';
import { ArrowUpRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const MaterialStudySection: React.FC = () => {
  const { setActiveCategory } = useUI();

  const handleStudyClick = (tag: string) => {
    if (tag.includes('Membrane')) setActiveCategory('outerwear');
    else if (tag.includes('Natural')) setActiveCategory('tailoring');
    else setActiveCategory('knitwear');

    const el = document.getElementById('collection-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="material-study"
      aria-label="Atelier Materiality & Textile Studies"
      className="w-full max-w-[1920px] mx-auto bg-background border-b border-border"
    >
      {/* Section Header Row */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="micro-label text-muted-foreground block mb-1">
            ARCHIVAL RESEARCH & DEVELOPMENT
          </span>
          <h2 className="editorial-title text-base sm:text-xl font-semibold text-foreground">
            Material Studies & Origins
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-light max-w-md leading-relaxed">
          We construct garments from raw yarn forwards, developing proprietary bonded membranes in Okayama and regenerative double-faced wools in Northern Italy.
        </p>
      </div>

      {/* 3-Column Material Grid with 1px architectural lines */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-l border-border divide-y md:divide-y-0 md:divide-x divide-border">
        {MATERIAL_STUDIES.map((study, idx) => (
          <div
            key={study.id}
            onClick={() => handleStudyClick(study.tag)}
            className="group flex flex-col bg-card border-r border-border hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            {/* Image Preview */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-subtle border-b border-border">
              <ImageWithFallback
                src={study.image}
                alt={study.name}
                className="w-full h-full object-cover luxury-image-zoom filter brightness-[0.95]"
              />
              <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-xs text-foreground px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-border">
                {study.tag}
              </div>
            </div>

            {/* Study Info */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                  <span>0{idx + 1} / {study.origin}</span>
                  <span className="font-semibold text-foreground">{study.weight}</span>
                </div>
                <h3 className="text-sm font-medium tracking-tight text-foreground group-hover:opacity-75 transition-opacity flex items-center justify-between">
                  <span>{study.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-muted-foreground" />
                </h3>
                <p className="text-xs text-muted-foreground font-light mt-2.5 leading-relaxed">
                  {study.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                <span>Inspect silhouettes in this weave</span>
                <span className="text-foreground font-bold">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
