export type ThemeMode = "dark" | "light";

export const preferenceCookie = {
  theme: "lotto_theme"
} as const;

export function isThemeMode(value: string | undefined): value is ThemeMode {
  return value === "dark" || value === "light";
}
