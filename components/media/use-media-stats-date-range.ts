"use client"

import { useMediaStats } from "@/lib/media/hooks"
import { format } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"

/** Parse API ISO / date string as a local calendar day (avoid TZ day-shift). */
function parseApiDate(value: string): Date {
  const day = value.slice(0, 10)
  const [year, month, date] = day.split("-").map(Number)
  return new Date(year, month - 1, date)
}

function todayLocal(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export interface UseMediaStatsDateRangeOptions {
  /** Seed [defaultFrom, today] and always send that range until the user overrides. */
  defaultFrom?: string | null
  /** When false, the underlying stats query stays disabled. */
  enabled?: boolean
}

export function useMediaStatsDateRange(
  campaignId?: string | null,
  options?: UseMediaStatsDateRangeOptions
) {
  const defaultFrom = options?.defaultFrom?.trim() || null
  const queryEnabled = options?.enabled ?? true

  const [range, setRange] = useState<DateRange | undefined>()
  const [userControlled, setUserControlled] = useState(false)

  const seededRange = useMemo<DateRange | undefined>(() => {
    if (!defaultFrom) return undefined
    return {
      from: parseApiDate(defaultFrom),
      to: todayLocal(),
    }
  }, [defaultFrom])

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
