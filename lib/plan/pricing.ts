import type { Plan, PlanQuota } from "./types"

export const PLAN_ORDER = ["free", "starter", "pro", "business"] as const

export type PlanSlug = (typeof PLAN_ORDER)[number]

export interface PlanMeta {
  tagline: string
  cta: string
  highlight: boolean
  extraFeatures: string[]
}

export const PLAN_META: Record<PlanSlug, PlanMeta> = {
  free: {
    tagline: "To explore",
    cta: "Start for free",
    highlight: false,
    extraFeatures: ["Community support"],
  },
  starter: {
    tagline: "To get started",
    cta: "Choose Starter",
    highlight: false,
    extraFeatures: ["Email support"],
  },
  pro: {
    tagline: "Most popular",
    cta: "Choose Pro",
    highlight: true,
    extraFeatures: ["Priority analysis"],
  },
  business: {
    tagline: "For teams",
    cta: "Choose Business",
    highlight: false,
    extraFeatures: ["Dedicated support", "Highest throughput"],
  },
}

export function getBasePlanSlug(slug: string): PlanSlug | string {
  if (slug === "free") return "free"
  if (slug.startsWith("starter")) return "starter"
  if (slug.startsWith("pro")) return "pro"
  if (slug.startsWith("business")) return "business"
  return slug
}

export function formatPlanPrice(amount: number, currency: string): string {
  if (amount === 0) return "Free"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatMoneyCents(cents: number, currency?: string | null): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "EUR").toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US")
}

export function normalizeBillingInterval(interval: string): "month" | "year" {
  if (interval === "year" || interval === "annually" || interval === "annual") {
    return "year"
  }
  return "month"
}

export function getPlanForInterval(
  plans: Plan[],
  baseSlug: string,
  interval: string
): Plan | undefined {
  const billingInterval = normalizeBillingInterval(interval)

  const exact = plans.find(
    (plan) =>
      getBasePlanSlug(plan.slug) === baseSlug &&
      normalizeBillingInterval(plan.billingInterval) === billingInterval &&
      plan.isActive
  )
  if (exact) return exact

  if (billingInterval === "year") {
    return plans.find(
      (plan) =>
        getBasePlanSlug(plan.slug) === baseSlug &&
        normalizeBillingInterval(plan.billingInterval) === "month" &&
        plan.isActive
    )
  }

  return undefined
}

export function getQuotaFeatures(quota: PlanQuota): string[] {
  return [
    `${formatCount(quota.maxVerificationsPerMonth)} verifications / month`,
    `${formatCount(quota.maxCampaigns)} campaigns`,
    `${formatCount(quota.maxClientMembers)} members`,
    `${formatCount(quota.maxConcurrentAnalyses)} concurrent analyses`,
    `Files up to ${formatCount(quota.maxFileSizeMb)} MB`,
    `${quota.reportRetentionDays} days report retention`,
    quota.allowsVideoAnalysis ? "Video analysis" : "Images only",
    quota.allowsPdfExport ? "PDF export" : "No PDF export",
    quota.allowsCsvExport ? "CSV export" : "No CSV export",
    quota.overagePriceCents > 0
      ? "Verification overage allowed"
      : "Hard verification limit",
  ]
}
