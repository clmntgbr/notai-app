import type { BackgroundStatus } from "@/lib/campaign/types"

export type ContentStatus =
  | "pending_upload"
  | "uploaded"
  | "analyzing"
  | "analyzed"
  | "failed"
  /** @deprecated Prefer `analyzed` + label. */
  | "verified"
  /** @deprecated Prefer `analyzed` + label. */
  | "flagged"

export type ContentLabel = "human" | "ai_generated" | "uncertain"

export interface ContentStats {
  pendingUpload: number
  uploaded: number
  analyzing: number
  analyzed: number
  failed: number
  human: number
  aiGenerated: number
  uncertain: number
}

/** Nested campaign on a content item. Omitted when the campaign is the client default. */
export interface ContentCampaign {
  id: string
  name: string
  backgroundStatus: BackgroundStatus
  backgroundThumbnailUrl?: string
  startAt?: string | null
  endAt?: string | null
}

export interface Content {
  id: string
  campaignId: string
  clientId: string
  filename: string
  contentType: string
  status: ContentStatus
  label?: ContentLabel | null
  sizeBytes?: number | null
  thumbnailUrl?: string
  /** Present only when the content is not on the default campaign. */
  campaign?: ContentCampaign
  createdAt: string
  updatedAt: string
}

export const MAX_CONTENT_FILES = 20

export const ACCEPTED_CONTENT_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
] as const

export interface PresignContentFileInput {
  filename: string
  contentType?: string
}

export interface PresignContentsInput {
  /** Optional. Empty / omitted → backend uses the client's default campaign. */
  campaignId?: string | null
  files: PresignContentFileInput[]
}

export interface PresignContentItem {
  contentId: string
  url: string
  objectKey: string
  filename: string
}

export interface PresignContentsResponse {
  /** Campaign actually used (resolved default when none was sent). */
  campaignId: string
  items: PresignContentItem[]
}

export type ContentUploadStatus =
  | "idle"
  | "presigning"
  | "uploading"
  | "done"
  | "error"

export function isContentProcessing(status: ContentStatus) {
  return status === "pending_upload" || status === "analyzing"
}

/** Thumbnail is available once status is past pending_upload (except failed). */
export function contentHasThumbnail(status: ContentStatus) {
  return (
    status === "uploaded" ||
    status === "analyzing" ||
    status === "analyzed" ||
    status === "verified" ||
    status === "flagged"
  )
}
