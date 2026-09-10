"use client"

import { useUser, useSwitchClient } from "@/lib/user/hooks"
import { ClientContext } from "./context"

/**
 * Thin UI context for the active tenant only.
 * Client/campaign entity data lives in React Query — not here.
 */
export function ClientProvider({ children }: { children: React.ReactNode }) {
  const { currentClientId } = useUser()
  const switchClient = useSwitchClient()

  return (
    <ClientContext.Provider
      value={{
        currentClientId,
        switchClient: async (clientId: string) => {
          await switchClient.mutateAsync(clientId)
        },
        isSwitching: switchClient.isPending,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}
