"use client"

import { PaymentSuccess } from "@/components/billing/payment-success"
import { useRouter } from "next/navigation"

export default function SubscriptionSuccessPage() {
  const router = useRouter()

  return (
    <div className="h-full overflow-auto">
      <PaymentSuccess onGoHome={() => router.push("/")} />
    </div>
  )
}
