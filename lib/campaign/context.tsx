"use client"

import { createContext, useContext } from "react"
import { PaginateParams } from "@/lib/paginate"
import { Campaign, CampaignInput, CampaignState } from "./types"

export interface CampaignContextType extends CampaignState {
  fetchCampaigns: (params?: PaginateParams) => Promise<void>
  createCampaign: (input: CampaignInput) => Promise<Campaign>
  updateCampaign: (id: string, input: CampaignInput) => Promise<Campaign>
  deleteCampaign: (id: string) => Promise<void>
}

export const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
)

export const useCampaign = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error("useCampaign must be used within CampaignProvider")
  }
  return context
}
