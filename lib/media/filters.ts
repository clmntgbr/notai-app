import { MediaStatus, MediaVerdictLabel } from "@/lib/media/types"

/** Filter chips shown in the media drawer (badge-aligned). */
export type MediaFilterKey =
  | Exclude<MediaStatus, "analyzed">
  | MediaVerdictLabel

const STATUS_KEYS = new Set<MediaFilterKey>([
  "pending_upload",
  "uploaded",
  "processing",
  "failed",
])

const VERDICT_KEYS = new Set<MediaFilterKey>([
  "human",
  "uncertain",
  "ai_generated",
])

export const MEDIA_FILTER_OPTIONS: {
  key: MediaFilterKey
  label: string
  className: string
  /** Checkbox border + checked fill (avoid bg-current + text-white clash). */
  checkboxClassName: string
}[] = [
  {
    key: "pending_upload",
    label: "Waiting",
    className: "border-border bg-muted text-muted-foreground",
    checkboxClassName:
      "border-muted-foreground data-checked:border-muted-foreground data-checked:bg-muted-foreground",
  },
  {
    key: "uploaded",
    label: "Uploaded",
    className: "border-border bg-muted text-muted-foreground",
    checkboxClassName:
      "border-muted-foreground data-checked:border-muted-foreground data-checked:bg-muted-foreground",
  },
  {
    key: "processing",
    label: "Processing",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400",
    checkboxClassName:
      "border-sky-600 data-checked:border-sky-600 data-checked:bg-sky-600 dark:border-sky-400 dark:data-checked:border-sky-400 dark:data-checked:bg-sky-400",
  },
  {
    key: "human",
    label: "Human",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
    checkboxClassName:
      "border-emerald-600 data-checked:border-emerald-600 data-checked:bg-emerald-600 dark:border-emerald-400 dark:data-checked:border-emerald-400 dark:data-checked:bg-emerald-400",
  },
  {
    key: "uncertain",
    label: "To review",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
    checkboxClassName:
      "border-amber-600 data-checked:border-amber-600 data-checked:bg-amber-600 dark:border-amber-400 dark:data-checked:border-amber-400 dark:data-checked:bg-amber-400",
  },
  {
    key: "ai_generated",
    label: "AI",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400",
    checkboxClassName:
      "border-rose-600 data-checked:border-rose-600 data-checked:bg-rose-600 dark:border-rose-400 dark:data-checked:border-rose-400 dark:data-checked:bg-rose-400",
  },
  {
    key: "failed",
    label: "Failed",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
    checkboxClassName:
      "border-red-600 data-checked:border-red-600 data-checked:bg-red-600 dark:border-red-400 dark:data-checked:border-red-400 dark:data-checked:bg-red-400",
  },
]

/** Split UI filter keys into API query values. */
export function splitMediaFilterKeys(keys: MediaFilterKey[]): {
  statuses: string[]
  verdicts: string[]
} {
  const statuses: string[] = []
  const verdicts: string[] = []
  for (const key of keys) {
    if (STATUS_KEYS.has(key)) statuses.push(key)
    else if (VERDICT_KEYS.has(key)) verdicts.push(key)
  }
  return { statuses, verdicts }
}
