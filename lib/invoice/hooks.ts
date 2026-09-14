"use client"

import { useQuery } from "@tanstack/react-query"
import { PaginateParams } from "@/lib/paginate"
import { queryKeys } from "@/lib/query/keys"
import { useUser } from "@/lib/user/hooks"
import { listInvoices } from "./api"

export function useInvoices(
  params?: Pick<PaginateParams, "page" | "limit" | "sortBy" | "orderBy">,
  options?: { enabled?: boolean }
) {
  const { currentClientId } = useUser()

  return useQuery({
    queryKey: queryKeys.invoices.list(currentClientId ?? "none", params),
    queryFn: () => listInvoices(params),
    enabled: Boolean(currentClientId) && (options?.enabled ?? true),
  })
}
