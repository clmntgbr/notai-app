import { parseApiError } from "@/lib/api-error"
import { uploadToPresignedUrl } from "@/lib/campaign/api"
import { Paginated, PaginateParams, toSearchParams } from "@/lib/paginate"
import {
  DEFAULT_CAMPAIGN_PRESIGN_ID,
  Media,
  MediaDetail,
  MediaStats,
  PresignMediaResponse,
} from "./types"

export const listCampaignMedia = async (
  campaignId: string,
  params?: PaginateParams
): Promise<Paginated<Media>> => {
  const response = await fetch(
    `/api/campaigns/${campaignId}/media${toSearchParams(params)}`,
    { method: "GET" }
  )

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch media")
  }

  return response.json()
}

export const getMedia = async (id: string): Promise<MediaDetail> => {
  const response = await fetch(`/api/media/${id}`, { method: "GET" })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch media")
  }

  return response.json()
}

export const getMediaStats = async (): Promise<MediaStats> => {
  const response = await fetch("/api/media/stats", { method: "GET" })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch media stats")
  }

  return response.json()
}

export const getMediaContentThumbnailUrl = (
  mediaId: string,
  contentId: string,
  version?: string | number
) => {
  const query =
    version != null ? `?v=${encodeURIComponent(String(version))}` : ""
  return `/api/media/${mediaId}/contents/${contentId}/thumbnail${query}`
}

export const presignMedia = async (
  campaignId: string | null | undefined,
  files: { filename: string; contentType: string }[]
): Promise<PresignMediaResponse> => {
  const pathId = campaignId?.trim() || DEFAULT_CAMPAIGN_PRESIGN_ID

  const response = await fetch(`/api/campaigns/${pathId}/media/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files }),
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to presign media uploads")
  }

  return response.json()
}

export const uploadMedia = async (
  campaignId: string | null | undefined,
  files: File[],
  onFileProgress?: (fileIndex: number, percent: number) => void
): Promise<PresignMediaResponse> => {
  const result = await presignMedia(
    campaignId,
    files.map((file) => ({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
    }))
  )

  if (result.items.length !== files.length) {
    throw new Error("Presign response count does not match selected files")
  }

  await Promise.all(
    result.items.map(async (item, index) => {
      const file = files[index]
      if (!file) {
        throw new Error(`Missing file for presigned item ${item.mediaId}`)
      }

      await uploadToPresignedUrl(item.url, file, (percent) => {
        onFileProgress?.(index, percent)
      })
    })
  )

  return result
}
