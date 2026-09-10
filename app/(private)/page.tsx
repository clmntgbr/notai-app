"use client"

import { useCampaigns } from "@/lib/campaign/hooks"
import { useClients } from "@/lib/client/hooks"
import { useClientContext } from "@/lib/client/context"
import { useUser } from "@/lib/user/hooks"

export default function Page() {
  const { user } = useUser()
  const { currentClientId } = useClientContext()
  const clientsQuery = useClients()
  const campaignsQuery = useCampaigns()

  return (
    <pre>
      {JSON.stringify(
        {
          user,
          currentClientId,
          clients: clientsQuery.data?.members ?? [],
          campaigns: campaignsQuery.data?.members ?? [],
        },
        null,
        2
      )}
    </pre>
  )
}
