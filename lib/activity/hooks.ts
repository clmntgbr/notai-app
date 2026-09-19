"use client"

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { listActivity, ListActivityParams } from "./api"

export function useActivity(params?: ListActivityParams) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.activity.list(currentClientId ?? "none", params),
    queryFn: () => listActivity(params),
    enabled: Boolean(currentClientId),
    placeholderData: keepPreviousData,
  })
}

export function useInfiniteActivity(options?: {
  enabled?: boolean
  limit?: number
  campaignIds?: string[]
  search?: string | null
  from?: string | null
  to?: string | null
}) {
  const { currentClientId } = useUser()
  const limit = options?.limit ?? 20
  const enabled = options?.enabled ?? true
  const campaignIds = options?.campaignIds?.length
    ? options.campaignIds
    : undefined
  const search = options?.search?.trim() || undefined
  const from = options?.from?.trim() || null
  const to = from ? options?.to?.trim() || null : null
  const rangeValid = !(options?.to?.trim() && !from)

  return useInfiniteQuery({
    queryKey: queryKeys.activity.infinite(currentClientId ?? "none", {
      limit,
      campaignIds,
      search,
      from,
      to,
    }),
    queryFn: ({ pageParam }) =>
      listActivity({
        page: pageParam,
        limit,
        campaignIds,
        search,
        from,
        to,
        sortBy: "occurred_at",
        orderBy: "desc",
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: Boolean(currentClientId) && enabled && rangeValid,
    placeholderData: keepPreviousData,
  })
}
