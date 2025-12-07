'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ThemeMode } from '@/types/theme';

interface ThemeStoreContextType {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeStoreContext = createContext<ThemeStoreContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'task_manager_theme';

export function ThemeStoreProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // Silently fail if localStorage is not available
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Silently fail if localStorage is not available
    }

    // Apply theme to document
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const toggle = useCallback(() => {
    setModeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
  }, []);

  const value: ThemeStoreContextType = {
    mode,
    toggle,
    setMode,
  };

  return (
    <ThemeStoreContext.Provider value={value}>
      {children}
    </ThemeStoreContext.Provider>
  );
}

export function useThemeStore() {
  const context = useContext(ThemeStoreContext);
  if (context === undefined) {
    throw new Error('useThemeStore must be used within a ThemeStoreProvider');
  }
  return context;
}
