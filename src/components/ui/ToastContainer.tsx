import React from 'react';
import { useUI } from '../../context/UIContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[90] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 p-4 shadow-2xl border border-neutral-800 dark:border-neutral-200 flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0 mt-0.5" />
          )}
          {toast.type === 'warning' && (
            <AlertCircle className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-4 h-4 text-neutral-400 dark:text-neutral-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs font-light tracking-wide leading-relaxed">
            {toast.text}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white dark:hover:text-black transition-colors p-0.5"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
