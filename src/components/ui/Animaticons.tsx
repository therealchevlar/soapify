/**
 * @file Animaticons.tsx
 * @description Suite of refined, minimalist vector line animaticons for SOAPIFY.
 * Clean, modern, skincare-grade animations communicating state without visual clutter.
 */

import React from 'react';

export const IconDroplet: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#0284c7',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} transition-transform hover:scale-110`}
  >
    <path
      d="M12 2.5C12 2.5 5 11 5 15.5C5 19.0899 8.13401 22 12 22C15.866 22 19 19.0899 19 15.5C19 11 12 2.5 12 2.5Z"
      fill={color}
      fillOpacity="0.15"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 14C10 16 11.5 17.5 13.5 17.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
  </svg>
);

export const IconScentWaves: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#f59e0b',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <path
      d="M8 18C7.5 15 9.5 12 8.5 9C7.8 7 6.5 5.5 6.5 3.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 20C11.5 16.5 13.5 13.5 12.5 10.5C11.8 8.5 10.5 7 10.5 4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M16 18C15.5 15 17.5 12 16.5 9C15.8 7 14.5 5.5 14.5 3.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const IconSkinShield: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#0284c7',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <path
      d="M12 3L4 6.5V12C4 16.5 7.5 20.5 12 21.5C16.5 20.5 20 16.5 20 12V6.5L12 3Z"
      fill={color}
      fillOpacity="0.12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const IconBottleSilhouette: React.FC<{ className?: string; color?: string; filledPct?: number }> = ({
  className = 'w-6 h-6',
  color = '#0284c7',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <path
      d="M10 2H14V5H10V2Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 8C7 6.89543 7.89543 6 9 6H15C16.1046 6 17 6.89543 17 8V20C17 21.1046 16.1046 22 15 22H9C7.89543 22 7 21.1046 7 20V8Z"
      stroke={color}
      strokeWidth="1.6"
      fill={color}
      fillOpacity="0.12"
    />
    <path d="M12 2V0M12 0H9" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconSparkleCheck: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-5 h-5',
  color = '#059669',
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <circle cx="10" cy="10" r="9" fill={color} />
    <path
      d="M6 10.2L8.8 13L14 7.5"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconMixerVortex: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-6 h-6',
  color = '#f59e0b',
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} animate-spin`}
    style={{ animationDuration: '3s' }}
  >
    <path
      d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 2"
    />
    <circle cx="12" cy="12" r="3" fill={color} />
  </svg>
);
