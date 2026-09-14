"use client"

import { PaymentCancel } from "@/components/billing/payment-cancel"
import { useRouter } from "next/navigation"

/** Stripe cancel_url default points here (`REDIRECT_CANCEL_URL`). */
export default function SubscriptionFailedPage() {
  const router = useRouter()

  return (
    <div className="h-full overflow-auto">
      <PaymentCancel
        reason="cancelled"
        onGoHome={() => router.push("/pricing")}
      />
    </div>
  )
}
