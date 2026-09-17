import { ActivityFeed } from "@/components/activity/activity-feed"
import { Campaigns } from "@/components/campaign/campaigns"
import { HomeStats } from "@/components/home/home-stats"
import { RecentMedia } from "@/components/media/recent-media"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <HomeStats />
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
