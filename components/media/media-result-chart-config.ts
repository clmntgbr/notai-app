import type { ChartConfig } from "@/components/ui/chart"
import type { MediaStatsCounts } from "@/lib/media/types"

export const mediaResultChartConfig = {
  total: {
    label: "Total",
    color: "oklch(0.45 0.14 255)",
  },
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

export const MEDIA_RESULT_KEYS = [
  "human",
  "uncertain",
  "aiGenerated",
  "failed",
] as const satisfies ReadonlyArray<keyof MediaStatsCounts>

export const MEDIA_MONTHLY_SERIES_KEYS = [
  "total",
  ...MEDIA_RESULT_KEYS,
] as const

export function mediaResultTotal(counts: MediaStatsCounts) {
  return MEDIA_RESULT_KEYS.reduce((sum, key) => sum + counts[key], 0)
}

/** Total media per month = status buckets only (not labels). */
export function mediaMonthTotal(counts: MediaStatsCounts) {
  return (
    counts.analyzed +
    counts.failed +
    counts.processing +
    counts.uploaded +
    counts.pendingUpload
  )
}

export function formatControlMonth(month: string) {
  const [year, monthPart] = month.split("-")
  if (!year || !monthPart) return month
  const date = new Date(Number(year), Number(monthPart) - 1, 1)
  if (Number.isNaN(date.getTime())) return month
  return date.toLocaleDateString("en-US", { month: "long" })
}
