export interface Campaign {
  id: string
  clientId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CampaignInput {
  name: string
}

export interface CampaignState {
  campaigns: Campaign[]
  isLoading: boolean
  error: string | null
  total: number
  page: number
  limit: number
  totalPages: number
}

export type CampaignAction =
  | {
      type: "GET_CAMPAIGNS"
      payload: {
        members: Campaign[]
        total: number
        page: number
        limit: number
        totalPages: number
      }
    }
  | { type: "GET_CAMPAIGNS_ERROR"; payload: string }
  | { type: "GET_CAMPAIGNS_LOADING"; payload: boolean }
  | { type: "CLEAR_CAMPAIGNS" }
