import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { X } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useUI();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isSizeGuideOpen) return null;

  const sizingData = [
    { size: 'XS', chestCm: '92-96', chestIn: '36-38', waistCm: '76-80', waistIn: '30-31', sleeveCm: '84', sleeveIn: '33' },
    { size: 'S', chestCm: '96-100', chestIn: '38-40', waistCm: '80-84', waistIn: '31-33', sleeveCm: '86', sleeveIn: '34' },
    { size: 'M', chestCm: '100-106', chestIn: '40-42', waistCm: '84-90', waistIn: '33-35', sleeveCm: '88', sleeveIn: '35' },
    { size: 'L', chestCm: '106-112', chestIn: '42-44', waistCm: '90-96', waistIn: '35-38', sleeveCm: '90', sleeveIn: '35.5' },
    { size: 'XL', chestCm: '112-118', chestIn: '44-46', waistCm: '96-102', waistIn: '38-40', sleeveCm: '92', sleeveIn: '36' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeSizeGuide}
      />

      <div className="relative w-full max-w-2xl bg-background border border-border shadow-2xl z-10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="micro-label text-muted-foreground block">ATELIER DIMENSIONS</span>
            <h2 id="size-guide-title" className="editorial-title text-base sm:text-lg font-semibold">
              Garment Proportion & Sizing
            </h2>
          </div>
          <button
            onClick={closeSizeGuide}
            className="p-2 text-foreground hover:opacity-70 transition-opacity"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-light max-w-md">
            All Noir Atelier silhouettes are cut with architectural volume. Measurements reflect body dimensions with built-in ease.
          </p>

          <div className="flex items-center border border-border text-xs font-mono">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 transition-colors ${
                unit === 'cm' ? 'bg-foreground text-background font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 transition-colors ${
                unit === 'in' ? 'bg-foreground text-background font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-subtle border-b border-border">
              <tr>
                <th className="p-3 font-semibold uppercase tracking-widest text-[10px]">Size</th>
                <th className="p-3 font-semibold uppercase tracking-widest text-[10px]">Chest</th>
                <th className="p-3 font-semibold uppercase tracking-widest text-[10px]">Waist</th>
                <th className="p-3 font-semibold uppercase tracking-widest text-[10px]">Sleeve Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sizingData.map((row) => (
                <tr key={row.size} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-bold">{row.size}</td>
                  <td className="p-3 text-muted-foreground">{unit === 'cm' ? `${row.chestCm} cm` : `${row.chestIn} in`}</td>
                  <td className="p-3 text-muted-foreground">{unit === 'cm' ? `${row.waistCm} cm` : `${row.waistIn} in`}</td>
                  <td className="p-3 text-muted-foreground">{unit === 'cm' ? `${row.sleeveCm} cm` : `${row.sleeveIn} in`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-muted/20 border border-border text-xs text-muted-foreground space-y-1">
          <p className="font-mono text-[10px] text-foreground uppercase tracking-widest font-semibold">
            Bespoke Atelier Advice:
          </p>
          <p className="font-light">
            If you are between sizes or prefer a streamlined classic silhouette, take one size down. For the intended runway oversized drape, take your normal size.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={closeSizeGuide}
            className="py-2.5 px-6 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-medium"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
