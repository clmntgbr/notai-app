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

export const MEDIA_CONTROLS_SERIES_KEYS = [
  "total",
  ...MEDIA_RESULT_KEYS,
] as const

/** @deprecated Use MEDIA_CONTROLS_SERIES_KEYS */
export const MEDIA_MONTHLY_SERIES_KEYS = MEDIA_CONTROLS_SERIES_KEYS

export function mediaResultTotal(counts: MediaStatsCounts) {
  return MEDIA_RESULT_KEYS.reduce((sum, key) => sum + counts[key], 0)
}

/** Total media per bucket = status buckets only (not labels). */
export function mediaControlsTotal(counts: MediaStatsCounts) {
  return (
    counts.analyzed +
    counts.failed +
    counts.processing +
    counts.uploaded +
    counts.pendingUpload
  )
}

/** @deprecated Use mediaControlsTotal */
export const mediaMonthTotal = mediaControlsTotal

/** Format API day `YYYY-MM-DD` for chart axis. */
export function formatControlDay(day: string) {
  const [year, monthPart, dayPart] = day.split("-")
  if (!year || !monthPart || !dayPart) return day
  const date = new Date(Number(year), Number(monthPart) - 1, Number(dayPart))
  if (Number.isNaN(date.getTime())) return day
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function toDayKey(value: string): string | null {
  const day = value.trim().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null
  return day
}

function parseDayKey(day: string): Date | null {
  const [year, monthPart, dayPart] = day.split("-").map(Number)
  if (!year || !monthPart || !dayPart) return null
  const date = new Date(year, monthPart - 1, dayPart)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function formatDayKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const EMPTY_DAY_COUNTS = {
  pendingUpload: 0,
  uploaded: 0,
  processing: 0,
  analyzed: 0,
  failed: 0,
  human: 0,
  aiGenerated: 0,
  uncertain: 0,
} as const

/**
 * Expand daily rows so every calendar day in [from, to] appears (zeros when missing).
 * `from` / `to` accept YYYY-MM-DD or ISO timestamps.
 */
export function fillDailyControlsToRange<
  T extends {
    day: string
    pendingUpload: number
    uploaded: number
    processing: number
    analyzed: number
    failed: number
    human: number
    aiGenerated: number
    uncertain: number
  },
>(
  days: T[] | null | undefined,
  from?: string | null,
  to?: string | null
): T[] {
  const fromKey = from ? toDayKey(from) : null
  const toKey = to ? toDayKey(to) : null
  if (!fromKey || !toKey) return days ? [...days] : []

  const start = parseDayKey(fromKey)
  const end = parseDayKey(toKey)
  if (!start || !end || start > end) return days ? [...days] : []

  const byDay = new Map((days ?? []).map((entry) => [entry.day.slice(0, 10), entry]))
  const filled: T[] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    const key = formatDayKey(cursor)
    const existing = byDay.get(key)
    filled.push(
      existing ??
        ({
          day: key,
          ...EMPTY_DAY_COUNTS,
        } as T)
    )
    cursor.setDate(cursor.getDate() + 1)
  }

  return filled
}

