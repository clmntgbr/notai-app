"use client"

import { PaginateParams } from "@/lib/paginate"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { listActivity } from "./api"

export function useActivity(params?: PaginateParams) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.activity.list(currentClientId ?? "none", params),
    queryFn: () => listActivity(params),
    enabled: Boolean(currentClientId),
  })
}

export function useInfiniteActivity(options?: {
  enabled?: boolean
  limit?: number
}) {
  const { currentClientId } = useUser()
  const limit = options?.limit ?? 20
  const enabled = options?.enabled ?? true

  return useInfiniteQuery({
    queryKey: queryKeys.activity.infinite(currentClientId ?? "none", limit),
    queryFn: ({ pageParam }) => listActivity({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: Boolean(currentClientId) && enabled,
  })
}
