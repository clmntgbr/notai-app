import { ClientAction, ClientState } from "./types"

export const clientReducer = (
  state: ClientState,
  action: ClientAction
): ClientState => {
  switch (action.type) {
    case "GET_CLIENTS": {
      const currentClient =
        action.payload.members.find((client) => client.isActive) ?? null

      return {
        ...state,
        clients: action.payload.members,
        currentClient,
        total: action.payload.total,
        page: action.payload.page,
        limit: action.payload.limit,
        totalPages: action.payload.totalPages,
        isLoading: false,
        error: null,
      }
    }
    case "GET_CLIENTS_ERROR":
      return {
        ...state,
        clients: [],
        currentClient: null,
        isLoading: false,
        error: action.payload,
      }
    case "GET_CLIENTS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
