import { ActivityFeed } from "@/components/activity/activity-feed"
import { Campaigns } from "@/components/campaign/campaigns"
import { MediaStatsChart } from "@/components/media/media-stats-chart"
import { RecentMedia } from "@/components/media/recent-media"
import { SectionCards } from "@/components/section-cards"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <MediaStatsChart />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <RecentMedia />
        <ActivityFeed />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
        <Campaigns />
      </div>
    </div>
  )
}
