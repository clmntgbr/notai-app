export interface PlanQuota {
  id: string
  name: string
  maxClientMembers: number
  maxCampaigns: number
  maxVerificationsPerMonth: number
  maxConcurrentAnalyses: number
  maxFileSizeMb: number
  reportRetentionDays: number
  allowsVideoAnalysis: boolean
  allowsPdfExport: boolean
  allowsCsvExport: boolean
  allowsApiAccess: boolean
  overagePriceCents: number
  analysisPriority: number
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  description: string | null
  slug: string
  stripePriceId: string | null
  isActive: boolean
  billingInterval: "month" | "year"
  price: number
  currency: "EUR" | "USD" | string
  quotaId: string
  quota: PlanQuota
  createdAt: string
  updatedAt: string
}
