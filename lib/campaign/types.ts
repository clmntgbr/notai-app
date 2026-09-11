export type BackgroundStatus = "none" | "pending" | "ready" | "failed"

export interface Campaign {
  id: string
  clientId: string
  name: string
  backgroundStatus: BackgroundStatus
  backgroundThumbnailUrl?: string
  startAt?: string | null
  endAt?: string | null
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
