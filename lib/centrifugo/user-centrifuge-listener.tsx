"use client"

import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useRef } from "react"
import { claimRealtimeEventId } from "./event-dedupe"
import {
  isUserStreamEvent,
  shouldDebounceMediaRefresh,
  shouldRefreshActivity,
  shouldRefreshCampaignBackground,
  shouldRefreshMedia,
  shouldRefreshMediaDetail,
  shouldRefreshSubscription,
} from "./types"
import { useCentrifuge } from "./use-centrifuge"
import { useDebouncedCallback } from "./use-debounced-callback"

const MEDIA_REFRESH_DEBOUNCE_MS = 250

type PendingMediaRefresh = {
  clientIds: Set<string>
  mediaByClient: Map<string, Set<string>>
}

function emptyPendingMediaRefresh(): PendingMediaRefresh {
  return { clientIds: new Set(), mediaByClient: new Map() }
}

/**
 * Subscribes to user Centrifugo interest channels (account / media / content / activity).
 * Realtime only syncs cache — local mutations already refetch via React Query.
 *
 * Media channel contract (4 moments):
 * created → status_changed(uploaded) → status_changed(processing) → verdict_rendered
 *
 * Safety nets:
 * - dedupe by `eventId`
 * - debounce status_changed / verdict_rendered invalidations
 */
export function UserCentrifugeListener() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const pendingMediaRef = useRef<PendingMediaRefresh>(emptyPendingMediaRefresh())

  const flushMediaRefresh = useDebouncedCallback(() => {
    const pending = pendingMediaRef.current
    pendingMediaRef.current = emptyPendingMediaRefresh()

    console.log("[Centrifugo] flush media refresh", {
      clientIds: [...pending.clientIds],
      mediaByClient: Object.fromEntries(
        [...pending.mediaByClient.entries()].map(([clientId, ids]) => [
          clientId,
          [...ids],
        ])
      ),
    })

    for (const clientId of pending.clientIds) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.media.all(clientId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.all(clientId),
      })

      const mediaIds = pending.mediaByClient.get(clientId)
      if (!mediaIds) continue
      for (const mediaId of mediaIds) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.media.detail(clientId, mediaId),
        })
      }
    }
  }, MEDIA_REFRESH_DEBOUNCE_MS)

  const queueMediaRefresh = useCallback(
    (clientId: string, mediaId?: string) => {
      pendingMediaRef.current.clientIds.add(clientId)
      if (mediaId) {
        const set =
          pendingMediaRef.current.mediaByClient.get(clientId) ?? new Set()
        set.add(mediaId)
        pendingMediaRef.current.mediaByClient.set(clientId, set)
      }
      flushMediaRefresh()
    },
    [flushMediaRefresh]
  )

  const invalidateMediaNow = useCallback(
    (clientId: string, mediaId?: string) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.media.all(clientId),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.all(clientId),
      })
      if (mediaId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.media.detail(clientId, mediaId),
        })
      }
    },
    [queryClient]
  )

  const handlePublication = useCallback(
    (data: unknown) => {
      if (!isUserStreamEvent(data)) {
        console.log("[Centrifugo] ignored (unknown type)", data)
        return
      }

      if (!claimRealtimeEventId(data.eventId)) {
        console.log("[Centrifugo] ignored (duplicate eventId)", {
          type: data.type,
          eventId: data.eventId,
        })
        return
      }

      console.log("[Centrifugo] event", {
        type: data.type,
        eventId: data.eventId,
        userId: data.userId,
        clientId: data.clientId,
        campaignId: data.campaignId,
        mediaId: data.mediaId,
        status: data.status,
        backgroundStatus: data.backgroundStatus,
      })

      if (shouldRefreshCampaignBackground(data)) {
        const clientId = data.clientId!
        const campaignId = data.campaignId!
        console.log("[Centrifugo] invalidate campaigns", { clientId, campaignId })

        void queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.all(clientId),
        })
        void queryClient.invalidateQueries({
          queryKey: queryKeys.campaigns.detail(clientId, campaignId),
        })
      }

      if (shouldRefreshMedia(data)) {
        const clientId = data.clientId!
        const mediaId =
          typeof data.mediaId === "string" ? data.mediaId : undefined

        if (shouldDebounceMediaRefresh(data)) {
          console.log("[Centrifugo] queue media refresh (debounced)", {
            clientId,
            mediaId,
            type: data.type,
            status: data.status,
          })
          queueMediaRefresh(clientId, mediaId)
        } else {
          console.log("[Centrifugo] invalidate media (immediate)", {
            clientId,
            mediaId,
            type: data.type,
          })
          invalidateMediaNow(clientId, mediaId)
        }
      }

      if (shouldRefreshMediaDetail(data)) {
        const clientId = data.clientId!
        const mediaId = data.mediaId!
        console.log("[Centrifugo] invalidate media detail (content verdict)", {
          clientId,
          mediaId,
          contentId: data.contentId,
        })
        void queryClient.invalidateQueries({
          queryKey: queryKeys.media.detail(clientId, mediaId),
        })
      }

      if (shouldRefreshActivity(data)) {
        console.log("[Centrifugo] invalidate activity", {
          clientId: data.clientId,
        })
        void queryClient.invalidateQueries({
          queryKey: queryKeys.activity.all(data.clientId!),
        })
      }

      if (shouldRefreshSubscription(data)) {
        const clientId = data.clientId!
        console.log("[Centrifugo] invalidate subscription + quota", {
          clientId,
          mediaId: data.mediaId,
          type: data.type,
        })
        void queryClient.invalidateQueries({
          queryKey: queryKeys.subscription.detail(clientId),
        })
        void queryClient.invalidateQueries({
          queryKey: queryKeys.quota.detail(clientId),
        })
      }
    },
    [invalidateMediaNow, queryClient, queueMediaRefresh]
  )

  useCentrifuge(Boolean(user?.id), handlePublication)

  return null
}
