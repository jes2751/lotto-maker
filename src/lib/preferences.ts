export type ThemeMode = "dark" | "light";
export type Locale = "ko" | "en";

export const preferenceCookie = {
  theme: "lotto_theme",
  locale: "lotto_locale"
} as const;

export function isThemeMode(value: string | undefined): value is ThemeMode {
  return value === "dark" || value === "light";
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "ko" || value === "en";
}
