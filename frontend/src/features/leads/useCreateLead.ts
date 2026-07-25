import { useMutation } from "@tanstack/react-query"

import { createLead } from "@/lib/api/leads"

export function useCreateLead() {
  return useMutation({
    mutationFn: createLead,
  })
}
