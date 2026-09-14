import { parseApiError } from "@/lib/api-error"
import { Paginated, PaginateParams, toSearchParams } from "@/lib/paginate"
import type { Invoice } from "./types"

export async function listInvoices(
  params?: Pick<PaginateParams, "page" | "limit" | "sortBy" | "orderBy">
): Promise<Paginated<Invoice>> {
  const query = toSearchParams(params)
  const response = await fetch(`/api/invoices${query}`, { method: "GET" })

  if (!response.ok) {
    throw await parseApiError(response, "Failed to fetch invoices")
  }

  return response.json()
}
