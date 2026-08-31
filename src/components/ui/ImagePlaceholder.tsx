import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackColor?: string;
  className?: string;
  aspectRatio?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackColor = '#e5e5e0',
  className = '',
  aspectRatio,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[var(--surface-subtle)] ${className}`}
      style={{
        backgroundColor: fallbackColor,
        aspectRatio: aspectRatio || undefined,
      }}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 luxury-placeholder bg-neutral-200/60 dark:bg-neutral-800/60 z-0" />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center select-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400 mb-1">
            NOIR ATELIER
          </span>
          <span className="text-xs text-neutral-500 font-light truncate max-w-full">
            {alt}
          </span>
        </div>
      ) : (
        <img
          src={src || undefined}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};
