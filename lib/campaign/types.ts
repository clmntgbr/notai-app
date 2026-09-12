export type BackgroundStatus = "none" | "pending" | "ready" | "failed"

export interface CampaignContentCounts {
  pendingUpload: number
  uploaded: number
  analyzing: number
  failed: number
  human: number
  aiGenerated: number
  uncertain: number
}

export interface Campaign {
  id: string
  clientId: string
  name: string
  backgroundStatus: BackgroundStatus
  backgroundThumbnailUrl?: string
  startAt?: string | null
  endAt?: string | null
  contentCounts?: CampaignContentCounts
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

export const EMPTY_CAMPAIGN_CONTENT_COUNTS: CampaignContentCounts = {
  pendingUpload: 0,
  uploaded: 0,
  analyzing: 0,
  failed: 0,
  human: 0,
  aiGenerated: 0,
  uncertain: 0,
}

/** True when the campaign has contents beyond pending upload only. */
export function campaignHasContentActivity(counts: CampaignContentCounts) {
  return (
    counts.uploaded > 0 ||
    counts.analyzing > 0 ||
    counts.failed > 0 ||
    counts.human > 0 ||
    counts.aiGenerated > 0 ||
    counts.uncertain > 0
  )
}

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
