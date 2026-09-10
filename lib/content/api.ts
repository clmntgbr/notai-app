import { parseApiError } from "@/lib/api-error"
import { uploadToPresignedUrl } from "@/lib/campaign/api"
import {
  PresignContentsInput,
  PresignContentsResponse,
} from "./types"

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

export const getContentThumbnailUrl = (contentId: string) =>
  `/api/contents/${contentId}/thumbnail`
