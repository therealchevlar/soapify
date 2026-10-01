/**
 * @file MachineIllustration.tsx
 * @description Vector-grade interactive architectural schematic of the physical SOAPIFY
 * automated formulation dispensing station. Renders animated fluid lines, rotating pump heads,
 * calibrated reservoirs, and load cell stage.
 */

import React from 'react';
import { useMachine } from '../../context/MachineContext';

interface MachineIllustrationProps {
  className?: string;
  interactive?: boolean;
}

export const MachineIllustration: React.FC<MachineIllustrationProps> = ({
  className = '',
}) => {
  const { status } = useMachine();
  const activePumpId = status.activePumpId;
  const isMixing = status.mixing.active;
  const isFilling = status.filling.active;

  return (
    <div className={`relative flex items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800 ${className}`}>
      <svg
        viewBox="0 0 680 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[620px] select-none"
      >
        <defs>
          {/* Subtle grid pattern for lab schematic look */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>

          {/* Fluid glow filters */}
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Glass reflection gradient */}
          <linearGradient id="glass-reflection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.02" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.04" />
          </linearGradient>

          {/* Stainless steel chassis gradient */}
          <linearGradient id="chassis-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* Blueprint background grid */}
        <rect width="680" height="460" fill="url(#grid)" rx="16" />

        {/* Main Machine Frame / Outer Chassis */}
        <rect
          x="60"
          y="40"
          width="560"
          height="380"
          rx="18"
          fill="url(#chassis-metal)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Top Header Rail: Brand & Status LED */}
        <path d="M 60 75 L 620 75" stroke="#1E293B" strokeWidth="2" />
        <text x="85" y="63" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono" letterSpacing="0.15em">
          SOAPIFY // AUTOMATED DISPENSING MODULE v1.4
        </text>

        {/* LED Status Light */}
        <circle
          cx="585"
          cy="59"
          r="4"
          fill={status.connected ? (status.mode === 'DISPENSING' ? '#22D3EE' : '#34D399') : '#F43F5E'}
          className={status.mode === 'DISPENSING' ? 'animate-pulse' : ''}
        />
        <text x="595" y="63" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">
          {status.mode}
        </text>

        {/* ---------------------------------------------------- */}
        {/* SECTION 1: 5 INGREDIENT RESERVOIRS (TOP ROW)        */}
        {/* ---------------------------------------------------- */}
        {status.reservoirs.map((res, index) => {
          const x = 95 + index * 102;
          const y = 95;
          const w = 68;
          const h = 100;
          const fillHeight = (h * res.currentLevelPct) / 100;
          const isThisActive = activePumpId === res.pumpId;

          return (
            <g key={res.reservoirId} className="transition-all duration-300">
              {/* Reservoir Mounting Bracket */}
              <rect x={x - 4} y={y - 8} width={w + 8} height="8" rx="2" fill="#334155" />

              {/* Glass Reservoir Body */}
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="8"
                fill="#0B132B"
                stroke={isThisActive ? res.colorHex : '#1E293B'}
                strokeWidth={isThisActive ? '2' : '1'}
              />

              {/* Calibrated graduation tick marks on glass */}
              <line x1={x + 5} y1={y + 25} x2={x + 12} y2={y + 25} stroke="#334155" strokeWidth="1" />
              <line x1={x + 5} y1={y + 50} x2={x + 16} y2={y + 50} stroke="#475569" strokeWidth="1" />
              <line x1={x + 5} y1={y + 75} x2={x + 12} y2={y + 75} stroke="#334155" strokeWidth="1" />

              {/* Liquid Level */}
              <rect
                x={x + 2}
                y={y + h - fillHeight}
                width={w - 4}
                height={fillHeight}
                rx="6"
                fill={res.colorHex}
                opacity={isThisActive ? '0.75' : '0.45'}
              />

              {/* Glass reflection highlight overlay */}
              <rect x={x} y={y} width={w} height={h} rx="8" fill="url(#glass-reflection)" />

              {/* Reservoir Label */}
              <text x={x + w / 2} y={y + 115} fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                R-0{res.reservoirId}
              </text>
              <text x={x + w / 2} y={y + 126} fill="#64748B" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                {res.currentLevelPct}%
              </text>
            </g>
          );
        })}

        {/* ---------------------------------------------------- */}
        {/* SECTION 2: 5 PERISTALTIC PUMPS & FLUID TUBING       */}
        {/* ---------------------------------------------------- */}
        {status.pumps.map((pump, index) => {
          const rxCenter = 95 + index * 102 + 34;
          const pumpY = 245;
          const isThisActive = activePumpId === pump.pumpId;

          return (
            <g key={pump.pumpId}>
              {/* Fluid Feed Tube from Reservoir to Pump */}
              <path
                d={`M ${rxCenter} 195 L ${rxCenter} ${pumpY - 18}`}
                stroke={isThisActive ? status.reservoirs[index]?.colorHex : '#1E293B'}
                strokeWidth={isThisActive ? '3' : '2'}
                strokeDasharray={isThisActive ? '4 3' : 'none'}
                className={isThisActive ? 'animate-pulse' : ''}
              />

              {/* Peristaltic Pump Circular Housing */}
              <circle
                cx={rxCenter}
                cy={pumpY}
                r="18"
                fill="#0F172A"
                stroke={isThisActive ? '#38BDF8' : '#334155'}
                strokeWidth={isThisActive ? '2.5' : '1.5'}
              />

              {/* 3-Roller Rotor mechanism */}
              <g
                transform={`rotate(${isThisActive ? (Date.now() / 15) % 360 : 0} ${rxCenter} ${pumpY})`}
                className="transition-transform"
              >
                <circle cx={rxCenter} cy={pumpY - 9} r="4" fill={isThisActive ? '#38BDF8' : '#64748B'} />
                <circle cx={rxCenter - 8} cy={pumpY + 6} r="4" fill={isThisActive ? '#38BDF8' : '#64748B'} />
                <circle cx={rxCenter + 8} cy={pumpY + 6} r="4" fill={isThisActive ? '#38BDF8' : '#64748B'} />
                <circle cx={rxCenter} cy={pumpY} r="3" fill="#CBD5E1" />
              </g>

              {/* Pump Label */}
              <text x={rxCenter} y={pumpY + 28} fill="#64748B" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                P-0{pump.pumpId}
              </text>
            </g>
          );
        })}

        {/* ---------------------------------------------------- */}
        {/* SECTION 3: FLUID MANIFOLD CONVERGENCE & MIXER       */}
        {/* ---------------------------------------------------- */}
        {/* Fluid lines converging from 5 pumps to center mixing nozzle */}
        {status.pumps.map((pump, index) => {
          const rxCenter = 95 + index * 102 + 34;
          const isThisActive = activePumpId === pump.pumpId;
          const color = status.reservoirs[index]?.colorHex || '#38BDF8';

          return (
            <path
              key={`line-${pump.pumpId}`}
              d={`M ${rxCenter} 263 C ${rxCenter} 300, 340 290, 340 315`}
              stroke={isThisActive ? color : '#1E293B'}
              strokeWidth={isThisActive ? '3' : '1.5'}
              fill="none"
              strokeDasharray={isThisActive ? '4 2' : 'none'}
            />
          );
        })}

        {/* Center Homogenization / Dispense Nozzle Assembly */}
        <rect x="325" y="310" width="30" height="24" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <polygon points="334,334 346,334 342,348 338,348" fill="#64748B" />

        {/* Dispense Fluid Stream (when dispensing or filling) */}
        {(activePumpId !== null || isFilling) && (
          <line
            x1="340"
            y1="348"
            x2="340"
            y2="375"
            stroke={isFilling ? '#A78BFA' : status.reservoirs[(activePumpId || 1) - 1]?.colorHex || '#38BDF8'}
            strokeWidth="3.5"
            strokeLinecap="round"
            className="animate-pulse"
          />
        )}

        {/* ---------------------------------------------------- */}
        {/* SECTION 4: LOAD CELL SCALE PLATFORM & BOTTLE        */}
        {/* ---------------------------------------------------- */}
        {/* Load Cell Aluminum Billet & Cantilever */}
        <rect x="260" y="398" width="160" height="12" rx="3" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <rect x="290" y="392" width="100" height="6" rx="2" fill="#334155" />

        {/* Digital Load Cell Grams Readout Overlay on Platform */}
        <text
          x="340"
          y="420"
          fill="#38BDF8"
          fontSize="11"
          fontFamily="JetBrains Mono"
          fontWeight="bold"
          textAnchor="middle"
        >
          {status.loadCell.currentGrams.toFixed(1)} g / {status.loadCell.targetGrams > 0 ? status.loadCell.targetGrams.toFixed(1) : '250.0'} g
        </text>

        {/* The Luxury Cleanser Pump Bottle */}
        <g id="cleanser-bottle">
          {/* Bottle base body */}
          <rect
            x="315"
            y="350"
            width="50"
            height="42"
            rx="5"
            fill="#1E293B"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Liquid level inside bottle */}
          <rect
            x="317"
            y={390 - Math.min(36, (status.loadCell.currentGrams / Math.max(1, status.loadCell.targetGrams || 250)) * 36)}
            width="46"
            height={Math.min(36, (status.loadCell.currentGrams / Math.max(1, status.loadCell.targetGrams || 250)) * 36)}
            rx="3"
            fill="#38BDF8"
            opacity="0.6"
          />

          {/* Bottle pump cap & nozzle */}
          <rect x="330" y="342" width="20" height="8" rx="2" fill="#CBD5E1" />
          <path d="M 340 342 L 340 338 L 332 338" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Bottle Label with miniature SOAPIFY emblem */}
          <rect x="323" y="360" width="34" height="22" rx="2" fill="#0F172A" />
          <text x="340" y="372" fill="#F8FAFC" fontSize="6" fontFamily="Plus Jakarta Sans" fontWeight="bold" textAnchor="middle">
            SOAPIFY
          </text>
          <text x="340" y="378" fill="#64748B" fontSize="4.5" fontFamily="JetBrains Mono" textAnchor="middle">
            FORMULA
          </text>
        </g>

        {/* Homogenization Agitator Indicator */}
        {isMixing && (
          <g transform="translate(340, 322)">
            <circle cx="0" cy="0" r="14" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 3" className="animate-spin" />
            <text x="0" y="3" fill="#F59E0B" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
              650 RPM
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
