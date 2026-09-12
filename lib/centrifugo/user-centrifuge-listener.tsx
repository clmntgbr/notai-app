"use client"

import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import {
  isUserStreamEvent,
  shouldRefreshActivity,
  shouldRefreshCampaignBackground,
  shouldRefreshMedia,
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
        mediaId: data.mediaId,
        status: data.status,
        backgroundStatus: data.backgroundStatus,
        thumbnailKey: data.thumbnailKey,
        sizeBytes: data.sizeBytes,
        payload: data,
      })

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

      if (shouldRefreshMedia(data)) {
        const clientId = data.clientId!
        void queryClient.invalidateQueries({
          queryKey: queryKeys.media.all(clientId),
        })
        void queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.all(clientId),
        })
        if (typeof data.mediaId === "string") {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.media.detail(clientId, data.mediaId),
          })
        }
      }

      if (shouldRefreshActivity(data)) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.activity.all(data.clientId!),
        })
      }
    },
    [queryClient]
  )

  useCentrifuge(Boolean(user?.id), handlePublication)

  return null
}
