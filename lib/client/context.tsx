"use client"

import { createContext, useContext } from "react"
import { PaginateParams } from "@/lib/paginate"
import { Client, ClientInput, ClientState } from "./types"

export interface ClientContextType extends ClientState {
  fetchClients: (params?: PaginateParams) => Promise<void>
  createClient: (input: ClientInput) => Promise<Client>
  updateClient: (id: string, input: ClientInput) => Promise<Client>
  deleteClient: (id: string) => Promise<void>
  removeMember: (clientId: string, userId: string) => Promise<void>
  switchClient: (clientId: string) => Promise<void>
}

export const ClientContext = createContext<ClientContextType | undefined>(
  undefined
)

export const useClient = () => {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error("useClient must be used within ClientProvider")
  }
  return context
}
