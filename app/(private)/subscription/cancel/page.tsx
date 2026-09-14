"use client"

import { PaymentCancel } from "@/components/billing/payment-cancel"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SubscriptionCancelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason =
    searchParams.get("reason") === "declined" ? "declined" : "cancelled"

  return (
    <PaymentCancel reason={reason} onGoHome={() => router.push("/pricing")} />
  )
}

export default function SubscriptionCancelPage() {
  return (
    <div className="h-full overflow-auto">
      <Suspense fallback={null}>
        <SubscriptionCancelContent />
      </Suspense>
    </div>
  )
}
