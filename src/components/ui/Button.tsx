/**
 * @file Button.tsx
 * @description Tactile, accessible button component implementing the SOAPIFY design system:
 * Crisp white, sky blue, soft mint, and sunny yellow accents with micro-interactions.
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mint' | 'sunny' | 'outline' | 'ghost' | 'touch-large' | 'touch-danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center font-sans font-medium transition-all duration-200 select-none whitespace-nowrap active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50';

  const variants = {
    primary:
      'bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-2xl shadow-sm hover:shadow-md hover:shadow-sky-500/20 border border-sky-400/30',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-200 shadow-xs hover:border-slate-300 rounded-2xl',
    mint:
      'bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-sm hover:shadow-md hover:shadow-emerald-500/20 border border-emerald-400/30',
    sunny:
      'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl shadow-sm hover:shadow-md hover:shadow-amber-400/20 border border-amber-300',
    outline:
      'bg-transparent hover:bg-sky-50/60 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-2xl',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl',
    'touch-large':
      'bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold min-h-[58px] px-8 rounded-2xl shadow-lg shadow-sky-500/20 border border-sky-400/40 active:scale-95',
    'touch-danger':
      'bg-rose-500 hover:bg-rose-600 text-white text-lg font-bold min-h-[58px] px-8 rounded-2xl shadow-lg border border-rose-400/30 ring-4 ring-rose-100 active:scale-95',
  };

  const sizes = {
    sm: 'text-xs py-2 px-3.5 min-h-[38px] gap-1.5',
    md: 'text-sm py-2.5 px-5 min-h-[44px] gap-2',
    lg: 'text-base py-3.5 px-7 min-h-[50px] gap-2.5',
    xl: 'text-lg py-4 px-9 min-h-[58px] gap-3',
  };

  const selectedSize = variant.startsWith('touch') ? '' : sizes[size];

  return (
    <button
      className={`${base} ${variants[variant]} ${selectedSize} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Crafting...</span>
        </span>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
