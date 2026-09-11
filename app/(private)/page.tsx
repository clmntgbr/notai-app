import { Campaigns } from "@/components/campaigns"
import { RecentContents } from "@/components/content/recent-contents"
import { SectionCards } from "@/components/section-cards"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <RecentContents />
      </div>
      <Campaigns />
    </div>
  )
}
