"use client"

import { useCampaign } from "@/lib/campaign/context"
import { useClient } from "@/lib/client/context"
import { useUser } from "@/lib/user/context"

export default function Page() {
  const { user } = useUser()
  const { clients, currentClient } = useClient()
  const { campaigns } = useCampaign()

  return (
    <>
      <pre>{JSON.stringify({ user, currentClient, clients, campaigns }, null, 2)}</pre>
    </>
  )
}
