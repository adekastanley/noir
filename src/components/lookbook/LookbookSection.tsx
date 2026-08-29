import React, { useState } from 'react';
import { LOOKBOOK_CAMPAIGNS } from '../../data/lookbook';
import { ShoppableHotspots } from './ShoppableHotspots';
import { ImageWithFallback } from '../ui/ImagePlaceholder';
import { Tag, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const LookbookSection: React.FC = () => {
  const [currentCampaignIndex, setCurrentCampaignIndex] = useState(1); // Default to Volcanic Drift (matching bottom banner)
  const { isLookbookHotspotsVisible, toggleLookbookHotspots } = useUI();

  const campaign = LOOKBOOK_CAMPAIGNS[currentCampaignIndex] || LOOKBOOK_CAMPAIGNS[0];

  const nextCampaign = () => {
    setCurrentCampaignIndex((prev) => (prev + 1) % LOOKBOOK_CAMPAIGNS.length);
  };

  const prevCampaign = () => {
    setCurrentCampaignIndex((prev) => (prev - 1 + LOOKBOOK_CAMPAIGNS.length) % LOOKBOOK_CAMPAIGNS.length);
  };

  return (
    <section
      id="campaign-lookbook"
      aria-label="Editorial Lookbook & Campaign"
      className="w-full relative bg-background border-b border-border"
    >
      {/* Top Header Bar */}
      <div className="w-full max-w-[1920px] mx-auto border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="micro-label text-muted-foreground">CAMPAIGN STUDY</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-xs font-mono uppercase tracking-widest text-foreground font-medium">
            {campaign.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Interactive Hotspots Button */}
          <button
            onClick={toggleLookbookHotspots}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-colors flex items-center gap-1.5 ${
              isLookbookHotspotsVisible
                ? 'bg-foreground text-background border-foreground font-medium'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
            aria-label="Toggle shoppable tags on lookbook"
          >
            <Tag className="w-3 h-3" />
            <span className="hidden sm:inline">
              {isLookbookHotspotsVisible ? 'Tags: Active' : 'Tags: Hidden'}
            </span>
          </button>

          {/* Campaign Switcher Controls */}
          <div className="flex items-center border border-border">
            <button
              onClick={prevCampaign}
              className="p-1.5 hover:bg-muted transition-colors text-foreground"
              aria-label="Previous lookbook scene"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono text-muted-foreground">
              0{currentCampaignIndex + 1}/0{LOOKBOOK_CAMPAIGNS.length}
            </span>
            <button
              onClick={nextCampaign}
              className="p-1.5 hover:bg-muted transition-colors text-foreground"
              aria-label="Next lookbook scene"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Campaign Editorial Banner Container (Matching image bottom banner) */}
      <div className="w-full max-w-[1920px] mx-auto relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden group bg-neutral-950">
        <ImageWithFallback
          src={campaign.image}
          alt={`Noir Atelier ${campaign.title} Campaign`}
          className="w-full h-full object-cover luxury-image-zoom filter brightness-[0.88] contrast-[1.08]"
        />

        {/* Subtle Atmospheric Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

        {/* Interactive Hotspot Overlay */}
        {isLookbookHotspotsVisible && (
          <ShoppableHotspots hotspots={campaign.hotspots} />
        )}

        {/* Bottom Editorial Caption Stamp */}
        <div className="absolute bottom-6 sm:bottom-8 left-4 sm:left-8 z-10 max-w-xl text-white space-y-1.5 drop-shadow-md">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase">
              {campaign.season}
            </span>
            <span className="text-[10px] font-mono text-white/80 tracking-widest">
              {campaign.location}
            </span>
          </div>

          <h3 className="editorial-title text-base sm:text-xl font-medium tracking-[0.25em] text-white">
            {campaign.title}
          </h3>

          <p className="text-xs sm:text-[13px] text-white/80 font-light tracking-wide leading-relaxed">
            {campaign.tagline}
          </p>
        </div>

        {/* Bottom Right Shoppable Hint */}
        <div className="hidden sm:flex absolute bottom-8 right-8 z-10 items-center gap-2 text-white/70 text-[10px] font-mono tracking-widest bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Click glowing pins to inspect shoppable look</span>
        </div>
      </div>
    </section>
  );
};
