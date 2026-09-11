import { parseApiError } from "@/lib/api-error"
import { uploadToPresignedUrl } from "@/lib/campaign/api"
import { Paginated, PaginateParams } from "@/lib/paginate"
import {
  Content,
  PresignContentsInput,
  PresignContentsResponse,
} from "./types"

export interface ListContentsParams extends PaginateParams {
  campaignId?: string | null
}

export const listContents = async (
  params?: ListContentsParams
): Promise<Paginated<Content>> => {
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
  const response = await fetch(`/api/contents${query ? `?${query}` : ""}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch contents")
  }

  return response.json()
}

export const getContent = async (id: string): Promise<Content> => {
  const response = await fetch(`/api/contents/${id}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch content")
  }

  return response.json()
}

export const deleteContent = async (id: string): Promise<void> => {
  const response = await fetch(`/api/contents/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to delete content")
  }
}

export const presignContents = async (
  input: PresignContentsInput
): Promise<PresignContentsResponse> => {
  const campaignId = input.campaignId?.trim()
  const body: PresignContentsInput = {
    files: input.files,
    ...(campaignId ? { campaignId } : {}),
  }

  const response = await fetch("/api/contents/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to presign content uploads")
  }

  return response.json()
}

export const uploadContents = async (
  campaignId: string | null | undefined,
  files: File[],
  onFileProgress?: (fileIndex: number, percent: number) => void
): Promise<PresignContentsResponse> => {
  const result = await presignContents({
    campaignId,
    files: files.map((file) => ({
      filename: file.name,
      contentType: file.type || undefined,
    })),
  })

  if (result.items.length !== files.length) {
    throw new Error("Presign response count does not match selected files")
  }

  await Promise.all(
    result.items.map(async (item, index) => {
      const file = files[index]
      if (!file) {
        throw new Error(`Missing file for presigned item ${item.contentId}`)
      }

      await uploadToPresignedUrl(item.url, file, (percent) => {
        onFileProgress?.(index, percent)
      })
    })
  )

  return result
}

export const getContentThumbnailUrl = (
  contentId: string,
  version?: string | number
) => {
  const query =
    version != null ? `?v=${encodeURIComponent(String(version))}` : ""
  return `/api/contents/${contentId}/thumbnail${query}`
}
