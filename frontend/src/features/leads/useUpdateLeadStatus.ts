import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateLeadStatus } from "@/lib/api/leads"
import { LEADS_QUERY_KEY } from "@/features/leads/useLeadsQuery"
import type { LeadStatus } from "@/lib/validation/lead.schema"

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] })
    },
  })
}
