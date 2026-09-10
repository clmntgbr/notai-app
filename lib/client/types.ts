export interface Client {
  id: string
  name: string
  isActive: boolean
  memberIds: string[]
  createdAt: string
  updatedAt: string
}

export interface ClientInput {
  name: string
}

export interface ClientState {
  clients: Client[]
  currentClient: Client | null
  isLoading: boolean
  error: string | null
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ClientAction =
  | {
      type: "GET_CLIENTS"
      payload: {
        members: Client[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }
  | { type: "GET_CLIENTS_ERROR"; payload: string }
  | { type: "GET_CLIENTS_LOADING"; payload: boolean }
