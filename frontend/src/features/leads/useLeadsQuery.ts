import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { listLeads, type ListLeadsParams } from "@/lib/api/leads"

export const LEADS_QUERY_KEY = "leads"

export function useLeadsQuery(params: ListLeadsParams) {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, params],
    queryFn: () => listLeads(params),
    placeholderData: keepPreviousData,
  })
}
