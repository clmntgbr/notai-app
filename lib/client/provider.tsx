"use client"

import { useCallback, useEffect, useReducer } from "react"
import { PaginateParams } from "@/lib/paginate"
import { useUser } from "@/lib/user/context"
import {
  createClient as createClientApi,
  deleteClient as deleteClientApi,
  listClients,
  removeClientMember,
  updateClient as updateClientApi,
} from "./api"
import { ClientContext } from "./context"
import { clientReducer } from "./reducer"
import { ClientInput, ClientState } from "./types"

const initialState: ClientState = {
  clients: [],
  currentClient: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
}

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(clientReducer, initialState)
  const { fetchUser, switchClient } = useUser()

  const fetchClients = useCallback(async (params?: PaginateParams) => {
    try {
      dispatch({ type: "GET_CLIENTS_LOADING", payload: true })
      const data = await listClients(params)
      dispatch({ type: "GET_CLIENTS", payload: data })
    } catch {
      dispatch({ type: "GET_CLIENTS_ERROR", payload: "Failed to fetch clients" })
    } finally {
      dispatch({ type: "GET_CLIENTS_LOADING", payload: false })
    }
  }, [])

  const createClient = useCallback(
    async (input: ClientInput) => {
      const client = await createClientApi(input)
      await Promise.all([fetchUser(), fetchClients()])
      return client
    },
    [fetchClients, fetchUser]
  )

  const updateClient = useCallback(
    async (id: string, input: ClientInput) => {
      const client = await updateClientApi(id, input)
      await fetchClients()
      return client
    },
    [fetchClients]
  )

  const deleteClient = useCallback(
    async (id: string) => {
      await deleteClientApi(id)
      await Promise.all([fetchUser(), fetchClients()])
    },
    [fetchClients, fetchUser]
  )

  const removeMember = useCallback(
    async (clientId: string, userId: string) => {
      await removeClientMember(clientId, userId)
      await fetchClients()
    },
    [fetchClients]
  )

  const switchToClient = useCallback(
    async (clientId: string) => {
      // Single switch path: PUT /api/users/me/current-client (404 if unknown or non-member).
      await switchClient(clientId)
      await fetchClients()
    },
    [fetchClients, switchClient]
  )

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return (
    <ClientContext.Provider
      value={{
        ...state,
        fetchClients,
        createClient,
        updateClient,
        deleteClient,
        removeMember,
        switchClient: switchToClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}
