"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light";
export type ThemeMode = "dark" | "light" | "system";

export interface ThemeTriggerInfo {
  theme: Theme;
  themeMode: ThemeMode;
  originX: number;
  originY: number;
  timestamp: number;
  label: string;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  triggerInfo: ThemeTriggerInfo | null;
  toggleTheme: (e?: React.MouseEvent | MouseEvent) => void;
  setThemeMode: (mode: ThemeMode, e?: React.MouseEvent | MouseEvent) => void;
  clearTriggerInfo: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [triggerInfo, setTriggerInfo] = useState<ThemeTriggerInfo | null>(null);

  // Apply theme class to HTML element
  const applyThemeToDOM = useCallback((resolvedTheme: Theme) => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    }
  }, []);

  // Compute resolved theme from mode
  const resolveTheme = useCallback((mode: ThemeMode): Theme => {
    if (mode === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return "dark";
    }
    return mode;
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem("theme-preference") as ThemeMode | null;
    const modeToUse: ThemeMode = (savedMode === "light" || savedMode === "dark" || savedMode === "system") 
      ? savedMode 
      : "dark";
    
    const resolved = resolveTheme(modeToUse);
    setThemeModeState(modeToUse);
    setThemeState(resolved);
    applyThemeToDOM(resolved);

    // Media query listener for system mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const currentSaved = localStorage.getItem("theme-preference") as ThemeMode | null;
      if (currentSaved === "system") {
        const newResolved: Theme = e.matches ? "dark" : "light";
        setThemeState(newResolved);
        applyThemeToDOM(newResolved);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [applyThemeToDOM, resolveTheme]);

  // Transition and trigger theme change
  const executeThemeChange = (newMode: ThemeMode, e?: React.MouseEvent | MouseEvent) => {
    const newResolved = resolveTheme(newMode);
    
    // Extract origin coordinates for radial ripple wave
    let originX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let originY = 60;

    if (e && typeof e.clientX === "number" && typeof e.clientY === "number") {
      originX = e.clientX;
      originY = e.clientY;
    }

    const label = newMode === "system" 
      ? `System Auto-Sync (${newResolved === "dark" ? "Dark" : "Light"})` 
      : newResolved === "dark" 
        ? "Cyberpunk Dark Mode" 
        : "Clean Studio Light Mode";

    // Trigger visual feedback state
    setTriggerInfo({
      theme: newResolved,
      themeMode: newMode,
      originX,
      originY,
      timestamp: Date.now(),
      label,
    });

    setThemeModeState(newMode);
    setThemeState(newResolved);
    localStorage.setItem("theme-preference", newMode);
    applyThemeToDOM(newResolved);
  };

  const setThemeMode = (mode: ThemeMode, e?: React.MouseEvent | MouseEvent) => {
    executeThemeChange(mode, e);
  };

  const toggleTheme = (e?: React.MouseEvent | MouseEvent) => {
    // If currently dark, switch to light; if light, switch to dark
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    executeThemeChange(nextTheme, e);
  };

  const clearTriggerInfo = () => {
    setTriggerInfo(null);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeMode, 
      triggerInfo, 
      toggleTheme, 
      setThemeMode, 
      clearTriggerInfo 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
