"use client";

import { useSyncExternalStore } from "react";

type ThemePreference = "auto" | "light" | "dark";

const preferences: ThemePreference[] = ["auto", "light", "dark"];
const labels: Record<ThemePreference, string> = {
  auto: "Auto",
  light: "Light",
  dark: "Dark",
};
const symbols: Record<ThemePreference, string> = {
  auto: "◐",
  light: "☼",
  dark: "☾",
};

function resolvedTheme(preference: ThemePreference) {
  if (preference !== "auto") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  const theme = resolvedTheme(preference);
  root.dataset.themePreference = preference;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const preference = useSyncExternalStore<ThemePreference>(
    (onPreferenceChange) => {
      window.addEventListener("theme-preference-change", onPreferenceChange);
      const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemChange = () => {
        if (document.documentElement.dataset.themePreference === "auto") {
          applyTheme("auto");
        }
      };
      colorScheme.addEventListener("change", handleSystemChange);
      return () => {
        window.removeEventListener("theme-preference-change", onPreferenceChange);
        colorScheme.removeEventListener("change", handleSystemChange);
      };
    },
    () => {
      const rootPreference = document.documentElement.dataset.themePreference;
      return preferences.includes(rootPreference as ThemePreference)
        ? rootPreference as ThemePreference
        : "auto";
    },
    (): ThemePreference => "auto",
  );

  function cycleTheme() {
    const nextPreference = preferences[(preferences.indexOf(preference) + 1) % preferences.length];
    localStorage.setItem("theme-preference", nextPreference);
    applyTheme(nextPreference);
    window.dispatchEvent(new Event("theme-preference-change"));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`Color theme: ${labels[preference]}. Activate to switch.`}
      title={`Theme: ${labels[preference]}`}
    >
      <span aria-hidden="true">{symbols[preference]}</span>
      <span>{labels[preference]}</span>
    </button>
  );
}
