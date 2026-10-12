/**
 * @file TopNav.tsx
 * @description Primary navigation bar complying with the 3-zone contract.
 * Supports light & dark modes with persistent toggle.
 * Clearly separates Consumer Mode, Dedicated Machine Touchscreen Mode, and Engineering Mode.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { SoapifyLogo } from '../brand/SoapifyLogo';
import { Button } from '../ui/Button';
import { Sun, Moon, Monitor } from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    displayMode,
    setDisplayMode,
    isDemoActive,
    startDemo,
    stopDemo,
    theme,
    toggleTheme,
  } = useApp();

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'creator', label: 'Create Soap' },
    { id: 'batch-history', label: 'My Soaps' },
    { id: 'soap-dna', label: 'SOAP DNA' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md select-none shadow-xs transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center text-left focus-visible:outline-none cursor-pointer"
          aria-label="SOAPIFY Home"
        >
          <SoapifyLogo variant="compact" size="sm" theme={theme === 'dark' ? 'dark' : 'light'} />
        </button>

        {/* Zone 2: 4 clean consumer text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
          {navLinks.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative py-1.5 transition-colors hover:text-slate-900 dark:hover:text-slate-100 whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action toggles */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dark / Light Mode Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-500/40 rounded-xl transition-all shadow-xs cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Guided FYP Demo Button */}
          <Button
            size="sm"
            variant={isDemoActive ? 'secondary' : 'primary'}
            onClick={() => (isDemoActive ? stopDemo() : startDemo())}
            className="whitespace-nowrap cursor-pointer text-xs font-bold shadow-xs"
          >
            {isDemoActive ? 'Exit Demo' : 'Run Demo'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
