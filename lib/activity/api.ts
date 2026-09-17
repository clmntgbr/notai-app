import { parseApiError } from "@/lib/api-error"
import { appendArrayParams, Paginated, PaginateParams } from "@/lib/paginate"
import { ActivityItem } from "./types"

export interface ListActivityParams extends PaginateParams {
  /** Filter by one or more campaigns (`campaignIds[]=`). */
  campaignIds?: string[]
  /** YYYY-MM-DD or RFC3339. Alone = [from, now). */
  from?: string | null
  /** YYYY-MM-DD or RFC3339. Requires `from`. */
  to?: string | null
}

export const listActivity = async (
  params?: ListActivityParams
): Promise<Paginated<ActivityItem>> => {
  const searchParams = new URLSearchParams()
  if (params?.page != null) searchParams.set("page", String(params.page))
  if (params?.limit != null) searchParams.set("limit", String(params.limit))
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy)
  if (params?.orderBy) searchParams.set("orderBy", params.orderBy)
  if (params?.search) searchParams.set("search", params.search)
  if (params?.campaignIds?.length) {
    appendArrayParams(searchParams, "campaignIds", params.campaignIds)
  }
  const from = params?.from?.trim()
  const to = params?.to?.trim()
  if (from) searchParams.set("from", from)
  if (from && to) searchParams.set("to", to)

  const query = searchParams.toString()
  const response = await fetch(`/api/activity${query ? `?${query}` : ""}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch activity")
  }

  return response.json()
}
