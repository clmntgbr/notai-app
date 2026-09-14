export interface RealtimeConnection {
  token: string
  /** Account channel (legacy primary). Prefer `channels` when present. */
  channel: string
  /** Per-interest channels: account, media, content, activity. */
  channels?: Record<string, string>
  wsUrl: string
}

/** Quiet no-op when realtime is unavailable. */
export async function getRealtimeConnection(): Promise<RealtimeConnection | null> {
  try {
    const response = await fetch("/api/realtime/connection", {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as Partial<RealtimeConnection>

    if (!data.token || !data.channel) {
      return null
    }

    const wsUrl = data.wsUrl || process.env.NEXT_PUBLIC_CENTRIFUGO_URL
    if (!wsUrl) {
      return null
    }

    return {
      token: data.token,
      channel: data.channel,
      channels: data.channels,
      wsUrl,
    }
  } catch {
    return null
  }
}

/** Unique subscribe targets from a connection payload. */
export function connectionSubscribeChannels(
  connection: RealtimeConnection
): string[] {
  const fromMap = Object.values(connection.channels ?? {}).filter(Boolean)
  if (fromMap.length > 0) {
    return [...new Set(fromMap)]
  }
  return [connection.channel]
}
