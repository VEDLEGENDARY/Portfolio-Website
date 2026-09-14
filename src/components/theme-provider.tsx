"use client";

import { ThemeProvider as Provider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Provider attribute="data-theme" defaultTheme="light" enableSystem={false} storageKey="vp-theme">{children}</Provider>;
}
