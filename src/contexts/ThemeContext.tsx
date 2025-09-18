import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark-gold' | 'dark-blue' | 'dark-purple' | 'dark-green' | 'dark-red' | 'light-gold';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { 
    value: Theme; 
    name: string; 
    primary: string; 
    description: string;
  }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  {
    value: 'dark-gold' as Theme,
    name: 'Premium Gold',
    primary: '#F59E0B',
    description: 'Luxury gold accents on dark background'
  },
  {
    value: 'dark-blue' as Theme,
    name: 'Ocean Blue',
    primary: '#3B82F6',
    description: 'Professional blue with dark elegance'
  },
  {
    value: 'dark-purple' as Theme,
    name: 'Royal Purple',
    primary: '#8B5CF6',
    description: 'Sophisticated purple luxury theme'
  },
  {
    value: 'dark-green' as Theme,
    name: 'Emerald',
    primary: '#10B981',
    description: 'Premium emerald green accents'
  },
  {
    value: 'dark-red' as Theme,
    name: 'Racing Red',
    primary: '#EF4444',
    description: 'Bold red performance theme'
  },
  {
    value: 'light-gold' as Theme,
    name: 'Light Gold',
    primary: '#F59E0B',
    description: 'Elegant light theme with gold accents'
  }
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark-gold');

  useEffect(() => {
    const savedTheme = localStorage.getItem('auction-portal-theme') as Theme;
    if (savedTheme && themes.find(t => t.value === savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('auction-portal-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}