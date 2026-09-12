import type { ChartConfig } from "@/components/ui/chart"
import type { ContentStatsCounts } from "@/lib/content/types"

export const contentResultChartConfig = {
  human: {
    label: "Human",
    color: "oklch(0.55 0.15 163)",
  },
  uncertain: {
    label: "To review",
    color: "oklch(0.7 0.15 70)",
  },
  aiGenerated: {
    label: "AI",
    color: "oklch(0.6 0.2 20)",
  },
  failed: {
    label: "Failed",
    color: "oklch(0.65 0.14 230)",
  },
} satisfies ChartConfig

export const CONTENT_RESULT_KEYS = [
  "human",
  "uncertain",
  "aiGenerated",
  "failed",
] as const satisfies ReadonlyArray<keyof ContentStatsCounts>

export function contentResultTotal(counts: ContentStatsCounts) {
  return CONTENT_RESULT_KEYS.reduce((sum, key) => sum + counts[key], 0)
}

export function formatControlMonth(month: string) {
  const [year, monthPart] = month.split("-")
  if (!year || !monthPart) return month
  const date = new Date(Number(year), Number(monthPart) - 1, 1)
  if (Number.isNaN(date.getTime())) return month
  return date.toLocaleDateString("en-US", { month: "short" })
}
