import { CampaignAction, CampaignState } from "./types"

export const initialCampaignState: CampaignState = {
  campaigns: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
}

export const campaignReducer = (
  state: CampaignState,
  action: CampaignAction
): CampaignState => {
  switch (action.type) {
    case "GET_CAMPAIGNS":
      return {
        ...state,
        campaigns: action.payload.members,
        total: action.payload.total,
        page: action.payload.page,
        limit: action.payload.limit,
        totalPages: action.payload.totalPages,
        isLoading: false,
        error: null,
      }
    case "GET_CAMPAIGNS_ERROR":
      return {
        ...state,
        campaigns: [],
        isLoading: false,
        error: action.payload,
      }
    case "GET_CAMPAIGNS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "CLEAR_CAMPAIGNS":
      return {
        ...initialCampaignState,
      }
    default:
      return state
  }
}
