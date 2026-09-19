"use client"

import { useMediaStats } from "@/lib/media/hooks"
import { format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

/** Parse API ISO / date string as a local calendar day (avoid TZ day-shift). */
function parseApiDate(value: string): Date {
  const trimmed = value.trim()
  // Date-only: keep the calendar day as written (no UTC reinterpretation).
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, date] = trimmed.split("-").map(Number)
    return new Date(year, month - 1, date)
  }
  // Full ISO: use the viewer's local calendar day (e.g. 22:00Z → next day in Paris).
  const parsed = new Date(trimmed)
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
}

function todayLocal(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export interface UseMediaStatsDateRangeOptions {
  /** Seed range start (ISO or yyyy-MM-dd). With defaultTo omitted, end is today. */
  defaultFrom?: string | null
  /** Seed range end (ISO or yyyy-MM-dd). */
  defaultTo?: string | null
  /** When false, the underlying stats query stays disabled. */
  enabled?: boolean
}

export function useMediaStatsDateRange(
  campaignId?: string | null,
  options?: UseMediaStatsDateRangeOptions
) {
  const defaultFrom = options?.defaultFrom?.trim() || null
  const defaultTo = options?.defaultTo?.trim() || null
  const queryEnabled = options?.enabled ?? true

  const [range, setRange] = useState<DateRange | undefined>()
  const [userControlled, setUserControlled] = useState(false)

  const seededRange = useMemo<DateRange | undefined>(() => {
    if (!defaultFrom) return undefined
    return {
      from: parseApiDate(defaultFrom),
      to: defaultTo ? parseApiDate(defaultTo) : todayLocal(),
    }
  }, [defaultFrom, defaultTo])

  const displayRange = userControlled ? range : (range ?? seededRange)

  const from =
    (userControlled || seededRange) && displayRange?.from
      ? format(displayRange.from, "yyyy-MM-dd")
      : null
  const to =
    (userControlled || seededRange) && displayRange?.from && displayRange.to
      ? format(displayRange.to, "yyyy-MM-dd")
      : null

  const { data, isPlaceholderData } = useMediaStats({
    campaignId,
    from,
    to,
    enabled: queryEnabled && (seededRange ? Boolean(from) : true),
  })
  const dateReady = Boolean(displayRange?.from)

  useEffect(() => {
    setRange(undefined)
    setUserControlled(false)
  }, [campaignId])

  // Home: hydrate picker from API default window when the user has not overridden.
  useEffect(() => {
    if (seededRange || userControlled || isPlaceholderData || !data?.from) {
      return
    }
    setRange({
      from: parseApiDate(data.from),
      to: data.to ? parseApiDate(data.to) : undefined,
    })
  }, [data?.from, data?.to, userControlled, isPlaceholderData, seededRange])

  function onRangeChange(next: DateRange | undefined) {
    if (!next?.from) {
      setUserControlled(false)
      setRange(undefined)
      return
    }
    setUserControlled(true)
    setRange(next)
  }

  return {
    range: displayRange,
    from,
    to,
    dateReady,
    userControlled,
    onRangeChange,
  }
}
