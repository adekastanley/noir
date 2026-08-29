import React, { useState } from 'react';
import { newsletterApi } from '../../services/api/newsletterApi';
import { useCurrency } from '../../context/CurrencyContext';
import { SUPPORTED_CURRENCIES } from '../../data/currencies';
import type { CurrencyCode } from '../../types';
import { useUI } from '../../context/UIContext';
import { ArrowRight, Check, ShieldCheck, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const { showToast } = useUI();

  const [email, setEmail] = useState('');
  const [preference, setPreference] = useState<'all' | 'menswear' | 'womenswear' | 'objects'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await newsletterApi.subscribe(email, preference);
      if (res.success) {
        setSubscribed(true);
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'warning');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer aria-label="Atelier Footer & Information" className="w-full bg-background border-t border-border text-foreground">
      {/* Top Newsletter & VIP Inscription Row */}
      <div className="w-full max-w-[1920px] mx-auto border-b border-border grid grid-cols-1 lg:grid-cols-12">
        {/* Left Newsletter Info */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between space-y-6">
          <div>
            <span className="micro-label text-muted-foreground block mb-2">
              PRIVATE ATELIER DISPATCHES
            </span>
            <h3 className="editorial-title text-base sm:text-xl font-semibold text-foreground">
              VIP Inscription & Seasonal Previews
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-3 max-w-lg leading-relaxed">
              Gain privileged access to archival releases, private salon invitations, and limited textile field studies before public availability.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Strict Zero-Spam Atelier Policy
            </span>
            <span>·</span>
            <span>Bi-monthly Dispatches</span>
          </div>
        </div>

        {/* Right Inscription Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-card">
          {subscribed ? (
            <div className="p-6 bg-surface-subtle border border-border text-center space-y-2 animate-in fade-in">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-2">
                <Check className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-mono uppercase tracking-widest font-semibold text-foreground">
                Inscription Confirmed
              </h4>
              <p className="text-xs text-muted-foreground font-light">
                An invitation token has been dispatched to <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              {/* Category Preference Pills */}
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Select Focus:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(
                    [
                      { id: 'all', label: 'All Editions' },
                      { id: 'menswear', label: 'Silhouettes' },
                      { id: 'objects', label: 'Objects & Leather' },
                      { id: 'womenswear', label: 'Textiles' },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreference(p.id)}
                      className={`py-1.5 px-2 text-[10px] font-mono uppercase tracking-wider border text-center transition-colors ${
                        preference === p.id
                          ? 'bg-foreground text-background border-foreground font-semibold'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input & Submit */}
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-background border border-border text-foreground px-4 py-3 text-xs font-mono outline-none focus:border-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-foreground text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Joining...' : 'Subscribe'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Main Multi-Column Links Section */}
      <div className="w-full max-w-[1920px] mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 border-b border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Column 1: Brand Study */}
        <div className="p-6 sm:p-8 space-y-4 col-span-2 sm:col-span-2 lg:col-span-1 border-r border-border">
          <span className="editorial-title text-sm font-semibold tracking-[0.25em] text-foreground block">
            NOIR ATELIER
          </span>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            Contemporary silhouette and material study. Architectural outerwear, tailored wools, and sculptural objects.
          </p>
          <div className="pt-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            PARIS / TOKYO / LONDON
          </div>
        </div>

        {/* Column 2: Studio Collections */}
        <div className="p-6 sm:p-8 space-y-3">
          <span className="micro-label text-foreground font-semibold block mb-2">
            COLLECTIONS
          </span>
          <ul className="space-y-2 text-xs font-mono text-muted-foreground">
            <li><a href="#collection-grid" className="hover:text-foreground transition-colors">Edition 04: Silent Form</a></li>
            <li><a href="#campaign-lookbook" className="hover:text-foreground transition-colors">Volcanic Drift Campaign</a></li>
            <li><a href="#material-study" className="hover:text-foreground transition-colors">Biella Wool Studies</a></li>
            <li><a href="#material-study" className="hover:text-foreground transition-colors">Okayama Technical Shells</a></li>
            <li><a href="#collection-grid" className="hover:text-foreground transition-colors">Permanent Archive</a></li>
          </ul>
        </div>

        {/* Column 3: Client Care */}
        <div className="p-6 sm:p-8 space-y-3">
          <span className="micro-label text-foreground font-semibold block mb-2">
            CLIENT SERVICES
          </span>
          <ul className="space-y-2 text-xs font-mono text-muted-foreground">
            <li><a href="#atelier-faq" className="hover:text-foreground transition-colors">DHL Express Logistics</a></li>
            <li><a href="#atelier-faq" className="hover:text-foreground transition-colors">Complimentary Returns</a></li>
            <li><a href="#atelier-faq" className="hover:text-foreground transition-colors">Proportions & Sizing</a></li>
            <li><a href="#atelier-faq" className="hover:text-foreground transition-colors">Atelier Care & Repair</a></li>
            <li><a href="#atelier-faq" className="hover:text-foreground transition-colors">Private Client Concierge</a></li>
          </ul>
        </div>

        {/* Column 4: Atelier Locations */}
        <div className="p-6 sm:p-8 space-y-3">
          <span className="micro-label text-foreground font-semibold block mb-2">
            FLAGSHIP SALONS
          </span>
          <div className="space-y-2 text-xs font-mono text-muted-foreground">
            <div>
              <p className="text-foreground font-semibold text-[11px]">PARIS SALON</p>
              <p className="text-[10px]">14 Rue de Turenne, 75004</p>
            </div>
            <div>
              <p className="text-foreground font-semibold text-[11px]">TOKYO ATELIER</p>
              <p className="text-[10px]">5-7-22 Minami-Aoyama, Minato-ku</p>
            </div>
            <div>
              <p className="text-foreground font-semibold text-[11px]">LONDON ARCHIVE</p>
              <p className="text-[10px]">12 Savile Row, Mayfair</p>
            </div>
          </div>
        </div>

        {/* Column 5: Global Logistics & Currency */}
        <div className="p-6 sm:p-8 space-y-4 col-span-2 sm:col-span-1 lg:col-span-1">
          <span className="micro-label text-foreground font-semibold block mb-2">
            REGION / CURRENCY
          </span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="w-3.5 h-3.5" />
              <span>Active Currency:</span>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full bg-card border border-border text-foreground px-3 py-2 text-xs font-mono uppercase outline-none"
              aria-label="Select website currency"
            >
              {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code}>
                  {code} ({SUPPORTED_CURRENCIES[code].symbol}) — {SUPPORTED_CURRENCIES[code].rate === 1 ? 'Base' : `${SUPPORTED_CURRENCIES[code].rate}x`}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[10px] text-muted-foreground font-light leading-relaxed">
            All prices include local VAT and import duties. Real-time conversion applied.
          </p>
        </div>
      </div>

      {/* Bottom Row: Agency Credit Link & Legal Copyright */}
      <div className="w-full max-w-[1920px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} NOIR ATELIER SAS. ALL RIGHTS RESERVED.</span>
        </div>

        {/* Agency Attribution Link (Mandatory Requirement) */}
        <div className="flex items-center gap-1.5">
          <span>Crafted with architectural precision by</span>
          <a
            href="https://www.idibia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-semibold hover:underline underline-offset-4 transition-colors"
          >
            IDIBIA
          </a>
        </div>

        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest">
          <a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <span>·</span>
          <a href="#terms" className="hover:text-foreground transition-colors">Terms of Atelier</a>
          <span>·</span>
          <a href="#cookies" className="hover:text-foreground transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};
