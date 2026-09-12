import { parseApiError } from "@/lib/api-error"
import { Paginated, PaginateParams, toSearchParams } from "@/lib/paginate"
import { ActivityItem } from "./types"

export const listActivity = async (
  params?: PaginateParams
): Promise<Paginated<ActivityItem>> => {
  const response = await fetch(`/api/activity${toSearchParams(params)}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch activity")
  }

  return response.json()
}
