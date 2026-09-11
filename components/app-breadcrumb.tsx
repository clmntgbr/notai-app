"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCampaignDetail } from "@/lib/campaign/hooks"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

function CampaignBreadcrumbPage({ campaignId }: { campaignId: string }) {
  const { data: campaign, isLoading } = useCampaignDetail(campaignId)

  if (isLoading) {
    return <BreadcrumbPage>Loading…</BreadcrumbPage>
  }

  return (
    <BreadcrumbPage>{campaign?.name ?? "Campaign"}</BreadcrumbPage>
  )
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const params = useParams<{ id?: string }>()

  const isHome = pathname === "/"
  const isCampaignDetail =
    Boolean(params.id) && pathname.startsWith("/campaign/")

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {isHome ? (
            <BreadcrumbPage>Home</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {isCampaignDetail && params.id ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <CampaignBreadcrumbPage campaignId={params.id} />
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
