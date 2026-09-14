import { parseApiError } from "@/lib/api-error"
import { uploadToPresignedUrl } from "@/lib/campaign/api"
import { Paginated, PaginateParams } from "@/lib/paginate"
import {
  Media,
  MediaDetail,
  MediaStats,
  PresignMediaResponse,
} from "./types"

export interface ListMediaParams extends PaginateParams {
  campaignId?: string | null
}

export const listMedia = async (
  params?: ListMediaParams
): Promise<Paginated<Media>> => {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy)
  if (params?.orderBy) searchParams.set("orderBy", params.orderBy)
  if (params?.search) searchParams.set("search", params.search)
  if (params?.campaignId?.trim()) {
    searchParams.set("campaignId", params.campaignId.trim())
  }

  const query = searchParams.toString()
  const response = await fetch(`/api/medias${query ? `?${query}` : ""}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch media")
  }

  return response.json()
}

export const getMedia = async (id: string): Promise<MediaDetail> => {
  const response = await fetch(`/api/medias/${id}`, { method: "GET" })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch media")
  }

  return response.json()
}

export const getMediaStats = async (
  campaignId?: string | null
): Promise<MediaStats> => {
  const searchParams = new URLSearchParams()
  const trimmed = campaignId?.trim()
  if (trimmed) searchParams.set("campaignId", trimmed)

  const query = searchParams.toString()
  const response = await fetch(
    `/api/medias/stats${query ? `?${query}` : ""}`,
    { method: "GET" }
  )

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
  return `/api/medias/${mediaId}/contents/${contentId}/thumbnail${query}`
}

export const presignMedia = async (
  campaignId: string | null | undefined,
  files: { filename: string; contentType: string }[]
): Promise<PresignMediaResponse> => {
  const body: {
    files: { filename: string; contentType: string }[]
    campaignId?: string
  } = { files }

  const trimmed = campaignId?.trim()
  if (trimmed) body.campaignId = trimmed

  const response = await fetch("/api/medias/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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
