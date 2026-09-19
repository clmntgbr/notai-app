import type { ReactNode } from "react"

export interface CampaignSubheaderProps {
  children?: ReactNode
}

export function CampaignSubheader({ children }: CampaignSubheaderProps) {
  return (
    <div className="relative flex h-(--header-height) shrink-0 items-center border-b px-4 lg:px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  )
}
