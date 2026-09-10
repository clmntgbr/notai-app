"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listCampaigns } from "@/lib/campaign/api"
import { queryKeys } from "@/lib/query/keys"
import { getUser, setCurrentClient } from "./api"

export function useUser() {
  const query = useQuery({
    queryKey: queryKeys.user.me,
    queryFn: getUser,
  })

  return {
    user: query.data ?? null,
    currentClientId: query.data?.currentClientId ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: query.refetch,
  }
}

/**
 * User-driven client switch: HTTP is source of truth, then immediate
 * refetch of tenant-scoped queries. Do not wait for Centrifugo.
 */
export function useSwitchClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: setCurrentClient,
    onSuccess: async (user) => {
      queryClient.setQueryData(queryKeys.user.me, user)

      const clientId = user.currentClientId

      await queryClient.invalidateQueries({
        queryKey: queryKeys.clients.lists(),
      })

      if (clientId) {
        await queryClient.fetchQuery({
          queryKey: queryKeys.campaigns.list(clientId),
          queryFn: () => listCampaigns(),
        })
      }
    },
  })
}
