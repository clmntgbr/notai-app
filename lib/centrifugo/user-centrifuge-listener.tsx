"use client"

import { useCallback } from "react"
import { useUser } from "@/lib/user/hooks"
import { isUserStreamEvent } from "./types"
import { useCentrifuge } from "./use-centrifuge"

/**
 * Subscribes to the user Centrifugo channel.
 * For now: log events only — no refetch / invalidation.
 */
export function UserCentrifugeListener() {
  const { user } = useUser()

  const handlePublication = useCallback((data: unknown) => {
    if (!isUserStreamEvent(data)) {
      console.warn("[Centrifugo] ignored publication (unknown type)", data)
      return
    }

    console.log("[Centrifugo] event received", {
      type: data.type,
      userId: data.userId,
      clientId: data.clientId,
      campaignId: data.campaignId,
      payload: data,
    })
  }, [])

  useCentrifuge(Boolean(user?.id), handlePublication)

  return null
}
