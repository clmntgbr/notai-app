"use client"

import { Button } from "@/components/ui/button"
import { useInvoices } from "@/lib/invoice/hooks"
import type { Invoice } from "@/lib/invoice/types"
import { formatMoneyCents } from "@/lib/plan/pricing"
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Loader2,
  Lock,
  Receipt,
} from "lucide-react"
import { useState } from "react"

const PAGE_LIMIT = 5

interface InvoicesCardProps {
  isFree: boolean
  onGoPricing: () => void
}

export function InvoicesCard({ isFree, onGoPricing }: InvoicesCardProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, isFetching } = useInvoices(
    { page, limit: PAGE_LIMIT },
    { enabled: !isFree }
  )

  const invoices = data?.members ?? []
  const total = data?.total ?? 0
  const totalPages =
    data?.totalPages && data.totalPages > 0
      ? data.totalPages
      : total > 0
        ? Math.ceil(total / PAGE_LIMIT)
        : 0
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : page

  return (
    <section>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-base font-bold">Invoices</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {isFree
              ? "No invoices on the free plan"
              : isLoading
                ? "Loading…"
                : total === 0
                  ? "No invoices"
                  : `${total} invoice${total === 1 ? "" : "s"}`}
          </span>
        </div>

        {isFree ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">
              Invoices are available starting with the Starter plan.
            </p>
            <Button variant="outline" size="sm" onClick={onGoPricing}>
              View paid plans
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        ) : isLoading && invoices.length === 0 ? (
          <div className="flex items-center justify-center px-6 py-12">
            <Loader2
              className="size-5 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            Unable to load invoices
          </div>
        ) : invoices.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No invoices yet.
          </div>
        ) : (
          <>
            <div
              className={
                isFetching
                  ? "divide-y divide-border/40 opacity-60"
                  : "divide-y divide-border/40"
              }
            >
              {invoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFetching || safePage <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="size-3.5" aria-hidden="true" />
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground tabular-nums">
                  Page {safePage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFetching || safePage >= totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                >
                  Next
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const label = invoice.number || invoice.description || "Invoice"
  const dateValue =
    invoice.paidAt ?? invoice.stripeCreatedAt ?? invoice.createdAt
  const hostedUrl = invoice.hostedInvoiceUrl
  const downloadUrl = invoice.invoicePdf ?? invoice.hostedInvoiceUrl

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-3.5 transition-colors hover:bg-muted/30">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Receipt className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          {hostedUrl ? (
            <a
              href={hostedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              <span className="truncate">{label}</span>
              <ExternalLink className="size-3 shrink-0 opacity-60" aria-hidden="true" />
            </a>
          ) : (
            <p className="truncate text-sm font-semibold">{label}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatInvoiceDate(dateValue)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-semibold tabular-nums">
          {formatMoneyCents(invoice.total, invoice.currency)}
        </span>
        {downloadUrl ? (
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Download invoice ${label}`}
            >
              <Download className="size-3.5" aria-hidden="true" />
            </a>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="size-8" disabled>
            <Download className="size-3.5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  )
}

function formatInvoiceDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
