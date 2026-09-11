"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

// next-themes injects an inline <script> to prevent theme flicker (FOUC).
// React 19 warns about <script> inside client components; the script still
// runs correctly during SSR. Filter this known false positive in development.
const SCRIPT_TAG_WARNING = "Encountered a script tag while rendering React component"

if (
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  !(globalThis as { __suppressNextThemesScriptWarning?: boolean })
    .__suppressNextThemesScriptWarning
) {
  ;(globalThis as { __suppressNextThemesScriptWarning?: boolean }).__suppressNextThemesScriptWarning =
    true
  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    const message = args.map((arg) => (typeof arg === "string" ? arg : "")).join(" ")
    if (message.includes(SCRIPT_TAG_WARNING)) {
      return
    }
    originalConsoleError.apply(console, args)
  }
}

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key?.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
