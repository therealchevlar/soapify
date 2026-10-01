/**
 * @file SoapifyLogo.tsx
 * @description Official SOAPIFY brand identity vector component.
 * Reproduces the hexagonal faceted 'S' emblem, modern geometric wordmark,
 * and official tagline: "PERSONALIZED. AUTOMATED. YOUR FORMULA."
 */

import React from 'react';

interface SoapifyLogoProps {
  variant?: 'full' | 'compact' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'touch';
  className?: string;
  theme?: 'dark' | 'light';
  showTagline?: boolean;
}

export const SoapifyLogo: React.FC<SoapifyLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
  theme = 'light',
  showTagline = false,
}) => {
  // Size metrics
  const emblemSizes = {
    sm: 28,
    md: 38,
    lg: 52,
    xl: 72,
    touch: 64,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
    touch: 'text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[7px] tracking-[0.25em]',
    md: 'text-[9px] tracking-[0.28em]',
    lg: 'text-xs tracking-[0.32em]',
    xl: 'text-sm tracking-[0.36em]',
    touch: 'text-xs tracking-[0.3em]',
  };

  const emblemDim = emblemSizes[size];

  // The Faceted Hexagon 'S' Icon
  const renderEmblem = () => (
    <svg
      width={emblemDim}
      height={emblemDim}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-label="SOAPIFY Brandmark"
    >
      <defs>
        {/* Gradients for faceted 3D low-poly hexagonal facets */}
        <linearGradient id="facet-top-left" x1="50" y1="5" x2="10" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
        <linearGradient id="facet-top-right" x1="50" y1="5" x2="90" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="100%" stopColor="#27272A" />
        </linearGradient>
        <linearGradient id="facet-mid-left" x1="10" y1="28" x2="10" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
        <linearGradient id="facet-mid-right" x1="90" y1="28" x2="90" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
        <linearGradient id="facet-bot-left" x1="10" y1="72" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#09090B" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
        <linearGradient id="facet-bot-right" x1="90" y1="72" x2="50" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#27272A" />
        </linearGradient>
        <linearGradient id="facet-center" x1="50" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="50%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>

        {/* Silver/white ribbon gradient */}
        <linearGradient id="ribbon-gradient" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F4F4F5" />
          <stop offset="100%" stopColor="#E4E4E7" />
        </linearGradient>
      </defs>

      {/* Hexagonal Outer Clipped Base */}
      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
        {/* Hexagonal Outer Vertices: (50, 5), (90, 27.5), (90, 72.5), (50, 95), (10, 72.5), (10, 27.5) */}
        
        {/* Facet 1: Top-Center to Top-Left */}
        <polygon points="50,5 10,27.5 35,42 50,30" fill="url(#facet-top-left)" />
        {/* Facet 2: Top-Center to Top-Right */}
        <polygon points="50,5 90,27.5 65,42 50,30" fill="url(#facet-top-right)" />
        {/* Facet 3: Mid-Left Outer */}
        <polygon points="10,27.5 10,72.5 30,55 35,42" fill="url(#facet-mid-left)" />
        {/* Facet 4: Mid-Right Outer */}
        <polygon points="90,27.5 90,72.5 70,55 65,42" fill="url(#facet-mid-right)" />
        {/* Facet 5: Bottom-Left Outer */}
        <polygon points="10,72.5 50,95 50,70 30,55" fill="url(#facet-bot-left)" />
        {/* Facet 6: Bottom-Right Outer */}
        <polygon points="90,72.5 50,95 50,70 70,55" fill="url(#facet-bot-right)" />
        {/* Center Triangular/Diamond facets */}
        <polygon points="50,30 35,42 50,55 65,42" fill="url(#facet-center)" opacity="0.9" />
        <polygon points="50,55 30,55 50,70 70,55" fill="#18181B" />

        {/* Crisp Hexagonal Edge Border */}
        <polygon
          points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
          fill="none"
          stroke="#52525B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* The White/Silver Geometric Interlocking 'S' Ribbon */}
        {/* Upper loop of S */}
        <path
          d="M 52 23 L 34 33 L 34 50 L 46 43 L 46 38 L 52 34 L 66 42 L 66 50 L 52 58 L 52 66 L 74 54 L 74 38 Z"
          fill="url(#ribbon-gradient)"
        />
        {/* Lower loop of S */}
        <path
          d="M 48 77 L 66 67 L 66 50 L 54 57 L 54 62 L 48 66 L 34 58 L 34 50 L 48 42 L 48 34 L 26 46 L 26 62 Z"
          fill="url(#ribbon-gradient)"
        />
      </g>
    </svg>
  );

  if (variant === 'mark-only') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900 dark:text-white';
  const taglineColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400';

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="inline-flex items-center gap-3">
        {renderEmblem()}
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <span
              className={`font-sans font-extrabold tracking-tight leading-none ${textSizes[size]} ${textColor}`}
              style={{ letterSpacing: '-0.03em' }}
            >
              SOAPIFY
            </span>
          </div>
        </div>
      </div>

      {(showTagline || variant === 'full') && (
        <span
          className={`font-sans font-semibold uppercase mt-1.5 ${taglineSizes[size]} ${taglineColor}`}
        >
          Personalized. Automated. Your Formula.
        </span>
      )}
    </div>
  );
};
