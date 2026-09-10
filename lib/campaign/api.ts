import { parseApiError } from "@/lib/api-error"
import { Paginated, PaginateParams, toSearchParams } from "@/lib/paginate"
import { Campaign, CampaignInput } from "./types"

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
    // 409 WRONG_ORGANIZATION when member of another client; otherwise 404.
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
