"use client"

import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import {
  isUserStreamEvent,
  shouldRefreshCampaignBackground,
} from "./types"
import { useCentrifuge } from "./use-centrifuge"

/**
 * Subscribes to the user Centrifugo channel.
 * Realtime only syncs cache — local mutations already refetch via React Query.
 */
export function UserCentrifugeListener() {
  const { user } = useUser()
  const queryClient = useQueryClient()

  const handlePublication = useCallback(
    (data: unknown) => {
      if (!isUserStreamEvent(data)) {
        console.warn("[Centrifugo] ignored publication (unknown type)", data)
        return
      }

      console.log("[Centrifugo] event received", {
        type: data.type,
        userId: data.userId,
        clientId: data.clientId,
        campaignId: data.campaignId,
        backgroundStatus: data.backgroundStatus,
        payload: data,
      })

      // backgroundStatus ready | failed | pending → thumbnail / status changed
      if (shouldRefreshCampaignBackground(data)) {
        const clientId = data.clientId!
        const campaignId = data.campaignId!

        void queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.all(clientId),
        })
        void queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.detail(clientId, campaignId),
        })
      }
    },
    [queryClient]
  )

  useCentrifuge(Boolean(user?.id), handlePublication)

  return null
}
