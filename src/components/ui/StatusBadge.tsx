/**
 * @file StatusBadge.tsx
 * @description Accessible status indicator pairing geometric glyph with explicit text label.
 */

import React from 'react';
import { MachineMode } from '../../types/machine';

interface StatusBadgeProps {
  mode: MachineMode | 'ONLINE' | 'OFFLINE' | 'SIMULATION' | 'HARDWARE' | 'SUCCESS';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ mode, label, size = 'md', className = '' }) => {
  let dotColor = 'bg-slate-400';
  let ringColor = 'ring-slate-400/20';
  let text = label || mode;
  let textColor = 'text-slate-300';
  let pulse = false;

  switch (mode) {
    case 'READY':
    case 'ONLINE':
    case 'SUCCESS':
    case 'COMPLETED':
      dotColor = 'bg-emerald-400';
      ringColor = 'ring-emerald-400/25';
      textColor = 'text-emerald-400';
      text = label || (mode === 'READY' ? 'System Ready' : mode === 'COMPLETED' ? 'Completed' : 'Online');
      break;
    case 'DISPENSING':
      dotColor = 'bg-cyan-400';
      ringColor = 'ring-cyan-400/30';
      textColor = 'text-cyan-400';
      text = label || 'Dispensing';
      pulse = true;
      break;
    case 'MIXING':
      dotColor = 'bg-amber-400';
      ringColor = 'ring-amber-400/25';
      textColor = 'text-amber-400';
      text = label || 'Homogenizing';
      pulse = true;
      break;
    case 'FILLING':
      dotColor = 'bg-indigo-400';
      ringColor = 'ring-indigo-400/25';
      textColor = 'text-indigo-400';
      text = label || 'Bottle Filling';
      pulse = true;
      break;
    case 'CALIBRATING':
      dotColor = 'bg-sky-400';
      ringColor = 'ring-sky-400/25';
      textColor = 'text-sky-400';
      text = label || 'Calibrating';
      pulse = true;
      break;
    case 'PAUSED':
      dotColor = 'bg-amber-400';
      ringColor = 'ring-amber-400/20';
      textColor = 'text-amber-300';
      text = label || 'Paused';
      break;
    case 'ERROR':
    case 'EMERGENCY_STOP':
      dotColor = 'bg-rose-500';
      ringColor = 'ring-rose-500/30';
      textColor = 'text-rose-400';
      text = label || (mode === 'EMERGENCY_STOP' ? 'EMERGENCY STOP' : 'System Error');
      pulse = true;
      break;
    case 'DISCONNECTED':
    case 'OFFLINE':
      dotColor = 'bg-slate-500';
      ringColor = 'ring-slate-500/20';
      textColor = 'text-slate-400';
      text = label || 'Disconnected';
      break;
    case 'SIMULATION':
      dotColor = 'bg-blue-400';
      ringColor = 'ring-blue-400/25';
      textColor = 'text-blue-300';
      text = label || 'Simulation Mode';
      break;
    case 'HARDWARE':
      dotColor = 'bg-emerald-400';
      ringColor = 'ring-emerald-400/25';
      textColor = 'text-emerald-300';
      text = label || 'ESP32 Hardware';
      break;
  }

  const sizeClasses = {
    sm: 'text-xs gap-1.5',
    md: 'text-xs gap-2 py-0.5',
    lg: 'text-sm gap-2.5 py-1 px-3',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium tracking-wide uppercase ${sizeClasses[size]} ${textColor} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ring-4 ${dotColor} ${ringColor}`}
        />
      </span>
      <span>{text}</span>
    </span>
  );
};
