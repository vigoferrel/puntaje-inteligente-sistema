
import React, { createContext, useContext, useEffect, useState } from "react";
import { unifiedStorageSystem } from "@/core/storage/UnifiedStorageSystem";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Usar ÚNICAMENTE UnifiedStorageSystem
    const savedTheme = unifiedStorageSystem.getItem('theme_preference') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("light", savedTheme === "light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    unifiedStorageSystem.setItem('theme_preference', newTheme, { silentErrors: true });
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      unifiedStorageSystem.setItem('theme_preference', newTheme, { silentErrors: true });
      document.documentElement.classList.toggle("light", newTheme === "light");
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
