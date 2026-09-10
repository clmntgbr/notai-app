import { parseApiError } from "@/lib/api-error"
import { Paginated, PaginateParams, toSearchParams } from "@/lib/paginate"
import {
  Campaign,
  CampaignInput,
  PresignBackgroundInput,
  PresignBackgroundResponse,
} from "./types"

export const listCampaigns = async (
  params?: PaginateParams
): Promise<Paginated<Campaign>> => {
  const response = await fetch(`/api/campaigns${toSearchParams(params)}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch campaigns")
  }

  return response.json()
}

export const getCampaign = async (id: string): Promise<Campaign> => {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch campaign")
  }

  return response.json()
}

export const createCampaign = async (
  input: CampaignInput
): Promise<Campaign> => {
  const response = await fetch("/api/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to create campaign")
  }

  return response.json()
}

export const updateCampaign = async (
  id: string,
  input: CampaignInput
): Promise<Campaign> => {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to update campaign")
  }

  return response.json()
}

export const deleteCampaign = async (id: string): Promise<void> => {
  const response = await fetch(`/api/campaigns/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to delete campaign")
  }
}

export const presignCampaignBackground = async (
  campaignId: string,
  input: PresignBackgroundInput
): Promise<PresignBackgroundResponse> => {
  const response = await fetch(
    `/api/campaigns/${campaignId}/background/presign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  )

  if (!response.ok) {
    throw await parseApiError(response, "Failed to presign background upload")
  }

  return response.json()
}

export const uploadToPresignedUrl = async (
  url: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream")

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return
      onProgress(Math.round((event.loaded * 100) / event.total))
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
        return
      }
      reject(new Error(`Upload failed with status ${xhr.status}`))
    }

    xhr.onerror = () => reject(new Error("Upload failed"))
    xhr.send(file)
  })
}

export const deleteCampaignBackground = async (
  campaignId: string
): Promise<void> => {
  const response = await fetch(`/api/campaigns/${campaignId}/background`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to delete background")
  }
}

export const uploadCampaignBackground = async (
  campaignId: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> => {
  const { url } = await presignCampaignBackground(campaignId, {
    filename: file.name,
    contentType: file.type || undefined,
  })

  await uploadToPresignedUrl(url, file, onProgress)
}
