import React, { useState } from 'react';
import { ImageWithFallback } from '../ui/ImagePlaceholder';
import { ArrowDown, Volume2, VolumeX } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const EditorialHero: React.FC = () => {
  const { showToast } = useUI();
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    setIsMuted(!isMuted);
    showToast(
      isMuted
        ? 'Ambient Soundscape: Westfjords Glacial Wind (Simulated)'
        : 'Soundscape Muted',
      'info'
    );
  };

  const scrollToCollection = () => {
    const el = document.getElementById('collection-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section aria-label="Campaign Hero Showcase" className="w-full relative bg-background">
      {/* Outer Grid Border Wrapper */}
      <div className="w-full max-w-[1920px] mx-auto border-b border-border">
        {/* Main Panoramic Editorial Visual Container */}
        <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[82vh] lg:h-[88vh] overflow-hidden group bg-neutral-900">
          <ImageWithFallback
            src="./assets/hero.jpg"
            alt="Noir Atelier Edition 04 Campaign — Land of Silence"
            className="w-full h-full object-cover luxury-image-zoom filter brightness-[0.92] contrast-[1.05]"
          />

          {/* Subtle cinematic gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 pointer-events-none" />

          {/* Top Editorial Coordinates Metadata */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-3">
            <span className="bg-black/30 backdrop-blur-md text-white/90 border border-white/20 px-2.5 py-1 text-[10px] font-mono tracking-[0.25em] uppercase">
              AUTUMN / WINTER 2026
            </span>
            <span className="hidden sm:inline-block text-white/70 text-[10px] font-mono tracking-widest drop-shadow-sm">
              65°45&apos;N 23°10&apos;W — WESTFJORDS
            </span>
          </div>

          {/* Top Right Ambient Audio & Coordinates */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white/90 border border-white/20 p-2 text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5"
              aria-label={isMuted ? 'Enable ambient soundscape' : 'Mute ambient soundscape'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">SOUNDSCAPE</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline text-emerald-400">PLAYING</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Centered Title Stamp (Exact Match to inspiration image) */}
          <div className="absolute bottom-6 sm:bottom-10 inset-x-0 z-10 flex flex-col items-center justify-center text-center px-4">
            <span className="text-white/80 font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-2 drop-shadow-sm">
              NOIR ATELIER — EDITION 04
            </span>
            <h1 className="text-white text-base sm:text-lg md:text-xl font-normal tracking-[0.35em] uppercase drop-shadow-md">
              LAND OF SILENCE
            </h1>
            <p className="text-white/75 text-[11px] sm:text-xs tracking-[0.2em] font-light max-w-lg mt-2 hidden sm:block">
              Sculptural silhouettes and unyielding raw materials engineered against elemental extremes.
            </p>

            {/* Jump button */}
            <button
              onClick={scrollToCollection}
              className="mt-4 sm:mt-5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 text-[10px] font-mono tracking-[0.25em] uppercase transition-all group/btn"
              aria-label="Scroll down to browse collection"
            >
              <span>Explore Collection</span>
              <ArrowDown className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
