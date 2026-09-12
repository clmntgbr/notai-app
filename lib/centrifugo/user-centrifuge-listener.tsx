"use client"

import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import {
  isUserStreamEvent,
  shouldRefreshActivity,
  shouldRefreshCampaignBackground,
  shouldRefreshContent,
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
        contentId: data.contentId,
        status: data.status,
        backgroundStatus: data.backgroundStatus,
        thumbnailKey: data.thumbnailKey,
        sizeBytes: data.sizeBytes,
        payload: data,
      })

      // campaign.background_updated → background thumbnail ready/failed
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

      // content.created (presign) | content.updated (thumbnail ready) | content.status_changed
      if (shouldRefreshContent(data)) {
        const clientId = data.clientId!
        void queryClient.invalidateQueries({
          queryKey: queryKeys.contents.all(clientId),
        })
        if (typeof data.contentId === "string") {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.contents.detail(clientId, data.contentId),
          })
        }
      }

      // activity.created → new feed row projected
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
