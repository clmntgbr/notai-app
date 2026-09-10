"use client"

import { useCallback, useEffect, useReducer } from "react"
import { getUser, setCurrentClient } from "./api"
import { UserContext } from "./context"
import { userReducer } from "./reducer"
import { UserState } from "./types"

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const fetchUser = useCallback(async () => {
    try {
      dispatch({ type: "GET_USER_LOADING", payload: true })
      const user = await getUser()
      dispatch({ type: "GET_USER", payload: user })
    } catch {
      dispatch({ type: "GET_USER_ERROR", payload: "Failed to fetch user" })
    } finally {
      dispatch({ type: "GET_USER_LOADING", payload: false })
    }
  }, [])

  const switchClient = useCallback(async (clientId: string) => {
    try {
      dispatch({ type: "GET_USER_LOADING", payload: true })
      const user = await setCurrentClient(clientId)
      dispatch({ type: "GET_USER", payload: user })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to set current client"
      dispatch({ type: "GET_USER_ERROR", payload: message })
      throw error
    } finally {
      dispatch({ type: "GET_USER_LOADING", payload: false })
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <UserContext.Provider
      value={{
        ...state,
        fetchUser,
        switchClient,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
