"use client"

import { createContext, useContext } from "react"

export interface ClientContextValue {
  currentClientId: string | null
  switchClient: (clientId: string) => Promise<void>
  isSwitching: boolean
}

export const ClientContext = createContext<ClientContextValue | undefined>(
  undefined
)

export function useClientContext() {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error("useClientContext must be used within ClientProvider")
  }
  return context
}
