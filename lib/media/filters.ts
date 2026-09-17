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
}[] = [
  {
    key: "pending_upload",
    label: "Waiting",
    className: "border-border bg-muted text-muted-foreground",
  },
  {
    key: "uploaded",
    label: "Uploaded",
    className: "border-border bg-muted text-muted-foreground",
  },
  {
    key: "processing",
    label: "Processing",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-400",
  },
  {
    key: "human",
    label: "Human",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
  {
    key: "uncertain",
    label: "To review",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400",
  },
  {
    key: "ai_generated",
    label: "AI",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400",
  },
  {
    key: "failed",
    label: "Failed",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400",
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
