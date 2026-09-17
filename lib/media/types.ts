export type MediaType = "image" | "video"

export type MediaStatus =
  | "pending_upload"
  | "uploaded"
  | "processing"
  | "analyzed"
  | "failed"

export type MediaVerdictLabel = "human" | "ai_generated" | "uncertain"

export interface MediaVerdict {
  label: MediaVerdictLabel
  flaggedCount: number
  totalCount: number
  failedCount: number
}

export interface MediaCampaign {
  id: string
  name: string
  backgroundStatus: string
  backgroundThumbnailUrl?: string
  startAt?: string | null
  endAt?: string | null
}

export interface Media {
  id: string
  campaignId: string
  filename: string
  mediaType: MediaType
  status: MediaStatus
  verdict?: MediaVerdict | null
  thumbnailUrl?: string | null
  failureReason?: string | null
  /** Present only when the media is not on the default campaign. */
  campaign?: MediaCampaign
  createdAt: string
  updatedAt: string
  analyzedAt?: string | null
}

export interface MediaContentChild {
  id: string
  frameIndex?: number | null
  timestampMs?: number | null
  status: string
  thumbnailUrl?: string | null
  verdict?: {
    label: MediaVerdictLabel | string
    confidence: number
  } | null
}

export interface MediaDetail extends Media {
  contents: MediaContentChild[]
}

export interface MediaStatsCounts {
  pendingUpload: number
  uploaded: number
  processing: number
  analyzed: number
  failed: number
  human: number
  aiGenerated: number
  uncertain: number
}

export interface MediaMonthlyControls extends MediaStatsCounts {
  month: string
}

export interface MediaKpis {
  month: string
  verifications: number
  verificationsChangePercent: number | null
  planIncluded: number | null
  authenticityRatePercent: number
  authenticityChangePoints: number | null
  validatedCount: number
  toReviewCount: number
  toReviewChangePercent: number | null
  aiGeneratedCount: number
  aiGeneratedSharePercent: number
}

export interface MediaStats extends MediaStatsCounts {
  /** Resolved range start (ISO / date string from API). */
  from?: string
  /** Resolved range end (ISO / date string from API). */
  to?: string
  monthlyControls: MediaMonthlyControls[]
  kpis: MediaKpis
}

export const MAX_MEDIA_FILES = 20

export const ACCEPTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const

export interface PresignMediaFileInput {
  filename: string
  contentType: string
}

export interface PresignMediaItem {
  mediaId: string
  url: string
  objectKey: string
  filename: string
  mediaType: MediaType | string
}

export interface PresignMediaResponse {
  campaignId: string
  items: PresignMediaItem[]
}

export function isMediaProcessing(status: MediaStatus) {
  return status === "pending_upload" || status === "processing"
}

export function mediaHasThumbnail(media: Media) {
  return (
    media.mediaType === "image" &&
    Boolean(media.thumbnailUrl) &&
    media.status !== "pending_upload" &&
    media.status !== "failed"
  )
}

export function formatFrameTimestamp(timestampMs: number) {
  const totalSeconds = Math.floor(timestampMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}
