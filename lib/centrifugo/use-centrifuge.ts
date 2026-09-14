"use client"

import { Centrifuge } from "centrifuge"
import { useEffect, useRef } from "react"
import {
  connectionSubscribeChannels,
  getRealtimeConnection,
} from "./api"

/**
 * Connects to Centrifugo using GET /api/realtime/connection and subscribes to
 * every interest channel (account / media / content / activity).
 * No-ops quietly when realtime is unavailable.
 */
export function useCentrifuge(
  enabled: boolean,
  onPublication: (data: unknown) => void
) {
  const onPublicationRef = useRef(onPublication)

  useEffect(() => {
    onPublicationRef.current = onPublication
  }, [onPublication])

  useEffect(() => {
    if (!enabled) return

    let centrifuge: Centrifuge | null = null
    let cancelled = false

    const connect = async () => {
      const connection = await getRealtimeConnection()
      if (cancelled || !connection) {
        console.warn("[Centrifugo] connection unavailable")
        return
      }

      const channels = connectionSubscribeChannels(connection)

      centrifuge = new Centrifuge(connection.wsUrl, {
        getToken: async () => {
          const next = await getRealtimeConnection()
          if (!next?.token) {
            throw new Error("Realtime token refresh failed")
          }
          return next.token
        },
      })

      for (const channel of channels) {
        const subscription = centrifuge.newSubscription(channel)

        subscription.on("publication", (ctx) => {
          console.log("[Centrifugo] publication", { channel, data: ctx.data })
          onPublicationRef.current(ctx.data)
        })

        subscription.on("subscribed", () => {
          console.log("[Centrifugo] subscribed", channel)
        })

        subscription.on("error", (ctx) => {
          console.warn("[Centrifugo] subscription error", channel, ctx)
        })

        subscription.subscribe()
      }

      centrifuge.on("connected", () => {
        console.log("[Centrifugo] connected", connection.wsUrl)
      })

      centrifuge.on("disconnected", (ctx) => {
        console.warn("[Centrifugo] disconnected", ctx)
      })

      centrifuge.connect()
      console.log("[Centrifugo] connecting…", {
        wsUrl: connection.wsUrl,
        channels,
      })
    }

    void connect()

    return () => {
      cancelled = true
      centrifuge?.disconnect()
    }
  }, [enabled])
}
