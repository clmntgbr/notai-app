export interface Invoice {
  id: string
  subscriptionId: string | null
  stripeInvoiceId: string | null
  number: string | null
  status: string | null
  currency: string | null
  amountDue: number
  amountPaid: number
  total: number
  hostedInvoiceUrl: string | null
  invoicePdf: string | null
  billingReason: string | null
  description: string | null
  attemptCount: number
  periodStart: string
  periodEnd: string
  paidAt: string | null
  stripeCreatedAt: string
  createdAt: string
  updatedAt: string
}
