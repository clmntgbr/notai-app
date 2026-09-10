"use client"

import { useCallback, useEffect, useReducer } from "react"
import { PaginateParams } from "@/lib/paginate"
import { useUser } from "@/lib/user/context"
import {
  createCampaign as createCampaignApi,
  deleteCampaign as deleteCampaignApi,
  listCampaigns,
  updateCampaign as updateCampaignApi,
} from "./api"
import { CampaignContext } from "./context"
import { campaignReducer, initialCampaignState } from "./reducer"
import { CampaignInput } from "./types"

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(campaignReducer, initialCampaignState)
  const { user } = useUser()
  const currentClientId = user?.currentClientId ?? null

  const fetchCampaigns = useCallback(async (params?: PaginateParams) => {
    try {
      dispatch({ type: "GET_CAMPAIGNS_LOADING", payload: true })
      const data = await listCampaigns(params)
      dispatch({ type: "GET_CAMPAIGNS", payload: data })
    } catch {
      dispatch({
        type: "GET_CAMPAIGNS_ERROR",
        payload: "Failed to fetch campaigns",
      })
    } finally {
      dispatch({ type: "GET_CAMPAIGNS_LOADING", payload: false })
    }
  }, [])

  const createCampaign = useCallback(
    async (input: CampaignInput) => {
      const campaign = await createCampaignApi(input)
      await fetchCampaigns()
      return campaign
    },
    [fetchCampaigns]
  )

  const updateCampaign = useCallback(
    async (id: string, input: CampaignInput) => {
      const campaign = await updateCampaignApi(id, input)
      await fetchCampaigns()
      return campaign
    },
    [fetchCampaigns]
  )

  const deleteCampaign = useCallback(
    async (id: string) => {
      await deleteCampaignApi(id)
      await fetchCampaigns()
    },
    [fetchCampaigns]
  )

  useEffect(() => {
    if (!currentClientId) {
      dispatch({ type: "CLEAR_CAMPAIGNS" })
      return
    }

    fetchCampaigns()
  }, [currentClientId, fetchCampaigns])

  return (
    <CampaignContext.Provider
      value={{
        ...state,
        fetchCampaigns,
        createCampaign,
        updateCampaign,
        deleteCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  )
}
