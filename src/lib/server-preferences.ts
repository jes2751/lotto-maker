import { cookies } from "next/headers";

import { isThemeMode, type ThemeMode, preferenceCookie } from "@/lib/preferences";

export async function getRequestPreferences() {
  try {
    const store = await cookies();
    const themeCookie = store.get(preferenceCookie.theme)?.value;

    return {
      theme: isThemeMode(themeCookie) ? themeCookie : ("dark" as ThemeMode),
      locale: "ko" as const
    };
  } catch {
    return {
      theme: "dark" as ThemeMode,
      locale: "ko" as const
    };
  }
}
