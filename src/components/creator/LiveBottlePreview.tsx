/**
 * @file LiveBottlePreview.tsx
 * @description Sophisticated cosmetic bottle visualizer that dynamically reflects
 * chosen color, fragrance, volume, and skin-type formula.
 */

import React from 'react';
import { ConsumerFragrance, SkinType, SoapColor } from '../../types/formulation';
import { SoapifyLogo } from '../brand/SoapifyLogo';

interface LiveBottlePreviewProps {
  color: SoapColor;
  fragrance: ConsumerFragrance;
  volumeMl: number;
  skinType: SkinType;
  customName?: string;
  className?: string;
}

export const COLOR_CONFIG: Record<
  SoapColor,
  { label: string; hex: string; gradient: string; opacity: number; specular: string }
> = {
  CLEAR: {
    label: 'Pure Translucent',
    hex: '#F1F5F9',
    gradient: 'from-slate-100/30 via-slate-200/20 to-slate-300/40',
    opacity: 0.35,
    specular: '#FFFFFF',
  },
  WHITE: {
    label: 'Milky Emulsion',
    hex: '#F8FAFC',
    gradient: 'from-white/90 via-slate-50/80 to-slate-100/90',
    opacity: 0.88,
    specular: '#FFFFFF',
  },
  PINK: {
    label: 'Rose Blossom',
    hex: '#F472B6',
    gradient: 'from-pink-300/70 via-rose-400/60 to-pink-500/75',
    opacity: 0.75,
    specular: '#FCE7F3',
  },
  BLUE: {
    label: 'Ocean Azure',
    hex: '#38BDF8',
    gradient: 'from-sky-300/75 via-cyan-400/65 to-blue-500/80',
    opacity: 0.78,
    specular: '#E0F2FE',
  },
  GREEN: {
    label: 'Botanical Herbal',
    hex: '#34D399',
    gradient: 'from-emerald-300/70 via-teal-400/65 to-emerald-500/80',
    opacity: 0.75,
    specular: '#D1FAE5',
  },
  LAVENDER: {
    label: 'Provencal Lilac',
    hex: '#A78BFA',
    gradient: 'from-violet-300/75 via-purple-400/65 to-indigo-500/80',
    opacity: 0.78,
    specular: '#EDE9FE',
  },
  AMBER: {
    label: 'Golden Resin',
    hex: '#FBBF24',
    gradient: 'from-amber-300/80 via-yellow-400/70 to-amber-500/85',
    opacity: 0.82,
    specular: '#FEF3C7',
  },
};

export const LiveBottlePreview: React.FC<LiveBottlePreviewProps> = ({
  color,
  fragrance,
  volumeMl,
  skinType,
  customName,
  className = '',
}) => {
  const current = COLOR_CONFIG[color] || COLOR_CONFIG.BLUE;

  // Adapt bottle geometry based on volume
  const bottleWidth = volumeMl === 100 ? 110 : volumeMl === 250 ? 134 : 156;
  const bottleHeight = volumeMl === 100 ? 210 : volumeMl === 250 ? 230 : 250;
  const pumpStemY = volumeMl === 100 ? 120 : volumeMl === 250 ? 110 : 100;

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden select-none ${className}`}
    >
      {/* Ambient color halo reflecting cleanser hue */}
      <div
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: current.hex }}
      />

      {/* SVG Bottle Configurator Graphic */}
      <div className="relative z-10 w-full flex items-center justify-center py-4">
        <svg
          width="260"
          height="340"
          viewBox="0 0 260 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300 drop-shadow-2xl"
        >
          <defs>
            {/* Liquid Fill Gradient */}
            <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={current.hex} stopOpacity={current.opacity} />
              <stop offset="60%" stopColor={current.hex} stopOpacity={current.opacity * 0.9} />
              <stop offset="100%" stopColor={current.hex} stopOpacity={current.opacity * 1.1} />
            </linearGradient>

            {/* Specular glass reflection */}
            <linearGradient id="glass-specular" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
            </linearGradient>

            {/* Frosted rim */}
            <linearGradient id="frosted-rim" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* 1. Pump Dispenser Head & Neck */}
          {/* Metal collar */}
          <rect x="118" y={pumpStemY} width="24" height="14" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <rect x="114" y={pumpStemY + 12} width="32" height="6" rx="1.5" fill="#CBD5E1" />

          {/* Pump actuator head */}
          <path
            d={`M 130 ${pumpStemY} L 130 ${pumpStemY - 14} Q 130 ${pumpStemY - 22} 122 ${pumpStemY - 22} L 96 ${pumpStemY - 22} Q 92 ${pumpStemY - 22} 92 ${pumpStemY - 17} L 92 ${pumpStemY - 12} L 98 ${pumpStemY - 12} L 98 ${pumpStemY - 16} L 122 ${pumpStemY - 16} Q 124 ${pumpStemY - 16} 124 ${pumpStemY - 12} L 124 ${pumpStemY} Z`}
            fill="#F8FAFC"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* Inner suction tube inside bottle */}
          <line
            x1="130"
            y1={pumpStemY + 18}
            x2="130"
            y2={pumpStemY + bottleHeight - 12}
            stroke="#CBD5E1"
            strokeWidth="2.5"
            strokeOpacity="0.6"
          />

          {/* 2. Glass Bottle Outer Container */}
          {(() => {
            const bx = 130 - bottleWidth / 2;
            const by = pumpStemY + 18;
            return (
              <g>
                {/* Back glass shadow */}
                <rect
                  x={bx}
                  y={by}
                  width={bottleWidth}
                  height={bottleHeight}
                  rx="16"
                  fill="#0F172A"
                  fillOpacity="0.6"
                />

                {/* Liquid Fill with meniscus */}
                <rect
                  x={bx + 3}
                  y={by + 16}
                  width={bottleWidth - 6}
                  height={bottleHeight - 19}
                  rx="14"
                  fill="url(#liquid-gradient)"
                  className="transition-all duration-500"
                />

                {/* Subtle buoyant liquid bubbles */}
                <circle cx={bx + bottleWidth * 0.3} cy={by + bottleHeight * 0.72} r="2.5" fill="#FFFFFF" fillOpacity="0.4" />
                <circle cx={bx + bottleWidth * 0.68} cy={by + bottleHeight * 0.58} r="1.8" fill="#FFFFFF" fillOpacity="0.35" />
                <circle cx={bx + bottleWidth * 0.42} cy={by + bottleHeight * 0.42} r="1.2" fill="#FFFFFF" fillOpacity="0.3" />
                <circle cx={bx + bottleWidth * 0.75} cy={by + bottleHeight * 0.8} r="2.0" fill="#FFFFFF" fillOpacity="0.25" />

                {/* Gentle meniscus wave on liquid surface */}
                <ellipse
                  cx="130"
                  cy={by + 16}
                  rx={(bottleWidth - 8) / 2}
                  ry="4"
                  fill={current.hex}
                  opacity={current.opacity * 0.9}
                />

                {/* Minimalist Cosmetic Label */}
                <rect
                  x={bx + 14}
                  y={by + bottleHeight * 0.35}
                  width={bottleWidth - 28}
                  height={bottleHeight * 0.42}
                  rx="6"
                  fill="#090D16"
                  fillOpacity="0.92"
                  stroke="#334155"
                  strokeWidth="1"
                />

                {/* Label Typography */}
                <text
                  x="130"
                  y={by + bottleHeight * 0.35 + 20}
                  fill="#FFFFFF"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans"
                  fontWeight="bold"
                  textAnchor="middle"
                  letterSpacing="0.08em"
                >
                  SOAPIFY
                </text>

                <text
                  x="130"
                  y={by + bottleHeight * 0.35 + 34}
                  fill={current.hex}
                  fontSize="8"
                  fontFamily="JetBrains Mono"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {fragrance}
                </text>

                <text
                  x="130"
                  y={by + bottleHeight * 0.35 + 46}
                  fill="#94A3B8"
                  fontSize="7"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {skinType.toLowerCase()} skin
                </text>

                <line
                  x1={bx + 24}
                  y1={by + bottleHeight * 0.35 + 53}
                  x2={bx + bottleWidth - 24}
                  y2={by + bottleHeight * 0.35 + 53}
                  stroke="#1E293B"
                  strokeWidth="0.8"
                />

                <text
                  x="130"
                  y={by + bottleHeight * 0.35 + 65}
                  fill="#CBD5E1"
                  fontSize="7"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {volumeMl} ML
                </text>

                {/* Glass reflection highlight overlay */}
                <rect
                  x={bx}
                  y={by}
                  width={bottleWidth}
                  height={bottleHeight}
                  rx="16"
                  fill="url(#glass-specular)"
                  pointerEvents="none"
                />

                {/* Crisp outer glass border */}
                <rect
                  x={bx}
                  y={by}
                  width={bottleWidth}
                  height={bottleHeight}
                  rx="16"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  pointerEvents="none"
                />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Product Summary Tag under preview */}
      <div className="text-center mt-2 space-y-1">
        <h4 className="text-sm font-bold text-white tracking-tight">
          {customName || `${fragrance} Cleanser`}
        </h4>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full ring-2 ring-slate-800"
              style={{ backgroundColor: current.hex }}
            />
            <span>{current.label}</span>
          </span>
          <span>·</span>
          <span>{volumeMl} ml</span>
        </div>
      </div>
    </div>
  );
};
