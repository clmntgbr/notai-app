export type BackgroundStatus = "none" | "pending" | "ready" | "failed"

/** Campaign aggregate counts — `analyzing` maps to media status `processing`. */
export interface CampaignMediaCounts {
  pendingUpload: number
  uploaded: number
  analyzing: number
  analyzed: number
  failed: number
  human: number
  aiGenerated: number
  uncertain: number
}

/** @deprecated Use CampaignMediaCounts */
export type CampaignContentCounts = CampaignMediaCounts

export interface Campaign {
  id: string
  clientId: string
  name: string
  isDefault?: boolean
  backgroundStatus: BackgroundStatus
  backgroundThumbnailUrl?: string
  startAt?: string | null
  endAt?: string | null
  mediaCounts?: CampaignMediaCounts
  /** @deprecated Prefer mediaCounts */
  contentCounts?: CampaignMediaCounts
  createdAt: string
  updatedAt: string
}

export interface CampaignInput {
  name: string
  startAt?: string | null
  endAt?: string | null
}

export interface PresignBackgroundInput {
  filename: string
  contentType?: string
}

export interface PresignBackgroundResponse {
  url: string
}

export const EMPTY_CAMPAIGN_MEDIA_COUNTS: CampaignMediaCounts = {
  pendingUpload: 0,
  uploaded: 0,
  analyzing: 0,
  analyzed: 0,
  failed: 0,
  human: 0,
  aiGenerated: 0,
  uncertain: 0,
}

/** @deprecated Use EMPTY_CAMPAIGN_MEDIA_COUNTS */
export const EMPTY_CAMPAIGN_CONTENT_COUNTS = EMPTY_CAMPAIGN_MEDIA_COUNTS

/** True when the campaign has media beyond pending upload only. */
export function campaignHasMediaActivity(counts: CampaignMediaCounts) {
  return (
    counts.uploaded > 0 ||
    counts.analyzing > 0 ||
    counts.analyzed > 0 ||
    counts.failed > 0 ||
    counts.human > 0 ||
    counts.aiGenerated > 0 ||
    counts.uncertain > 0
  )
}

/** @deprecated Use campaignHasMediaActivity */
export const campaignHasContentActivity = campaignHasMediaActivity

export const ACCEPTED_BACKGROUND_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const

export const ACCEPTED_BACKGROUND_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const

export const MAX_BACKGROUND_BYTES = 5 * 1024 * 1024
