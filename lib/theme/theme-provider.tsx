"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

// next-themes injects an inline <script> to prevent theme flicker (FOUC).
// React 19 warns about <script> inside client components; the script still
// runs correctly during SSR. Filter this known false positive in development.
const SCRIPT_TAG_WARNING = "Encountered a script tag while rendering React component";

if (
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  !(globalThis as { __suppressNextThemesScriptWarning?: boolean })
    .__suppressNextThemesScriptWarning
) {
  (globalThis as { __suppressNextThemesScriptWarning?: boolean }).__suppressNextThemesScriptWarning =
    true;
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args.map((arg) => (typeof arg === "string" ? arg : "")).join(" ");
    if (message.includes(SCRIPT_TAG_WARNING)) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme {...props}>
      {children}
    </NextThemesProvider>
  );
}
