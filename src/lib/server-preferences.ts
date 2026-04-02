import { cookies } from "next/headers";

import { isLocale, isThemeMode, type Locale, type ThemeMode, preferenceCookie } from "@/lib/preferences";

export async function getRequestPreferences() {
  try {
    const store = await cookies();
    const themeCookie = store.get(preferenceCookie.theme)?.value;
    const localeCookie = store.get(preferenceCookie.locale)?.value;

    return {
      theme: isThemeMode(themeCookie) ? themeCookie : ("dark" as ThemeMode),
      locale: isLocale(localeCookie) ? localeCookie : ("ko" as Locale)
    };
  } catch {
    return {
      theme: "dark" as ThemeMode,
      locale: "ko" as Locale
    };
  }
}
