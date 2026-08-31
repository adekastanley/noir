import React, { useState } from 'react';
import type { LookbookHotspot } from '../../types';
import { useProducts } from '../../api/queries';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { Plus, ArrowRight, X } from 'lucide-react';

interface ShoppableHotspotsProps {
  hotspots: LookbookHotspot[];
}

export const ShoppableHotspots: React.FC<ShoppableHotspotsProps> = ({ hotspots }) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { openQuickView, showToast } = useUI();
  const { data: productsData } = useProducts();

  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const getProduct = (productId: string) => {
    return productsData?.find((p) => p.id === productId);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {hotspots.map((hs) => {
        const product = getProduct(hs.productId);
        const isActive = activeHotspotId === hs.id;

        return (
          <div
            key={hs.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
          >
            {/* Hotspot Pin */}
            <button
              onClick={() => setActiveHotspotId(isActive ? null : hs.id)}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 group ${
                isActive
                  ? 'bg-white text-black border-white scale-110 shadow-lg'
                  : 'bg-black/60 hover:bg-black text-white border-white/60 backdrop-blur-md hover:scale-110'
              }`}
              aria-label={`Shoppable tag: ${hs.label}`}
              aria-expanded={isActive}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping absolute opacity-50" />
              <Plus className={`w-3.5 h-3.5 transition-transform ${isActive ? 'rotate-45' : 'group-hover:rotate-90'}`} />
            </button>

            {/* Floating Product Popover Card */}
            {isActive && product && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 bg-background text-foreground border border-border shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150 z-30 pointer-events-auto">
                <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-border">
                  <div>
                    <span className="micro-label text-muted-foreground block text-[9px]">
                      LOOKBOOK SILHOUETTE
                    </span>
                    <h4 className="text-xs font-semibold tracking-tight text-foreground line-clamp-1">
                      {product.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveHotspotId(null)}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                    aria-label="Close tag"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2.5 items-center">
                  <div className="w-14 h-16 bg-surface-subtle border border-border overflow-hidden shrink-0">
                    <img
                      src={product.images.primary}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] font-mono font-medium text-foreground">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">
                      {hs.detail}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setActiveHotspotId(null);
                          openQuickView(product);
                        }}
                        className="text-[10px] font-mono uppercase tracking-widest text-foreground hover:opacity-70 underline inline-flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-muted-foreground">·</span>
                      <button
                        onClick={() => {
                          addToCart(product, product.sizes[0], product.colorName, 1);
                          showToast(`Added "${product.name}" to your bag.`, 'success');
                          setActiveHotspotId(null);
                        }}
                        className="text-[10px] font-mono uppercase tracking-widest font-bold text-foreground hover:opacity-70"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
