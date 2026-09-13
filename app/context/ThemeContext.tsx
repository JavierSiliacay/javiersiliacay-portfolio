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
  const [theme, setThemeState] = useState<Theme>("light");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");
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
      return "light";
    }
    return mode;
  }, []);

  // Initialize theme: default to "light" unless user explicitly saved another preference
  useEffect(() => {
    let modeToUse: ThemeMode = "light";
    try {
      const saved = localStorage.getItem("theme-preference") as ThemeMode | null;
      if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
        modeToUse = saved;
      }
    } catch (e) {}

    const resolved = resolveTheme(modeToUse);
    setThemeModeState(modeToUse);
    setThemeState(resolved);
    applyThemeToDOM(resolved);

    // Media query listener only if system mode is explicitly chosen
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      try {
        const currentSaved = localStorage.getItem("theme-preference");
        if (currentSaved === "system") {
          const newResolved: Theme = e.matches ? "dark" : "light";
          setThemeState(newResolved);
          applyThemeToDOM(newResolved);
        }
      } catch (err) {}
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [applyThemeToDOM, resolveTheme]);

  // Transition and trigger theme change
  const executeThemeChange = (newMode: ThemeMode, e?: React.MouseEvent | MouseEvent) => {
    const newResolved = resolveTheme(newMode);
    
    // Extract origin coordinates for circular splash wave
    let originX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let originY = 60;

    if (e && typeof e.clientX === "number" && typeof e.clientY === "number" && e.clientX > 0 && e.clientY > 0) {
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

    const commitThemeState = () => {
      try {
        localStorage.setItem("theme-preference", newMode);
      } catch (err) {}
      setThemeModeState(newMode);
      setThemeState(newResolved);
      applyThemeToDOM(newResolved);
    };

    // Check if View Transitions API is supported and reduced motion is not preferred
    const doc = typeof document !== "undefined" ? (document as any) : null;
    const isAppearanceTransition =
      doc &&
      typeof doc.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isAppearanceTransition) {
      commitThemeState();
      return;
    }

    const transition = doc.startViewTransition(() => {
      commitThemeState();
    });

    transition.ready
      .then(() => {
        const right = window.innerWidth - originX;
        const bottom = window.innerHeight - originY;
        const maxRadius = Math.hypot(Math.max(originX, right), Math.max(originY, bottom));

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${originX}px ${originY}px)`,
              `circle(${maxRadius}px at ${originX}px ${originY}px)`,
            ],
          },
          {
            duration: 600,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        // Fallback gracefully if animation fails
      });
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
