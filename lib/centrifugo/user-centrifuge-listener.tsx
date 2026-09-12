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
 * Subscribes to the user Centrifugo channel.
 * Realtime only syncs cache — local mutations already refetch via React Query.
 *
 * Safety nets (not a substitute for correct backend fan-out):
 * - dedupe by `eventId` against republished duplicates
 * - debounce media.updated / media.status_changed invalidations
 *
 * Channel split is not available yet (single `users:<id>` channel) — type
 * filtering still happens after receive.
 */
export function UserCentrifugeListener() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const pendingMediaRef = useRef<PendingMediaRefresh>(emptyPendingMediaRefresh())

  const flushMediaRefresh = useDebouncedCallback(() => {
    const pending = pendingMediaRef.current
    pendingMediaRef.current = emptyPendingMediaRefresh()

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
        return
      }

      if (!claimRealtimeEventId(data.eventId)) {
        return
      }

      console.log("[Centrifugo] event received", {
        type: data.type,
        eventId: data.eventId,
        userId: data.userId,
        clientId: data.clientId,
        campaignId: data.campaignId,
        mediaId: data.mediaId,
        status: data.status,
        backgroundStatus: data.backgroundStatus,
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
        const mediaId =
          typeof data.mediaId === "string" ? data.mediaId : undefined

        if (shouldDebounceMediaRefresh(data)) {
          queueMediaRefresh(clientId, mediaId)
        } else {
          invalidateMediaNow(clientId, mediaId)
        }
      }

      if (shouldRefreshActivity(data)) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.activity.all(data.clientId!),
        })
      }
    },
    [invalidateMediaNow, queryClient, queueMediaRefresh]
  )

  useCentrifuge(Boolean(user?.id), handlePublication)

  return null
}
