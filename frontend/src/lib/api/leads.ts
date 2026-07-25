import { apiFetch } from "@/lib/api/client"
import type {
  CreateLeadInput,
  Lead,
  LeadSortField,
  LeadStatus,
  SortOrder,
} from "@/lib/validation/lead.schema"

export interface LeadsListResponse {
  data: Lead[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface ListLeadsParams {
  search?: string
  status?: LeadStatus | "all"
  page?: number
  limit?: number
  sortBy?: LeadSortField
  sortOrder?: SortOrder
}

export function createLead(input: CreateLeadInput): Promise<{ data: Lead }> {
  return apiFetch<{ data: Lead }>("/leads", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export function listLeads(params: ListLeadsParams): Promise<LeadsListResponse> {
  const query = new URLSearchParams()

  if (params.search) query.set("search", params.search)
  if (params.status && params.status !== "all")
    query.set("status", params.status)
  query.set("page", String(params.page ?? 1))
  query.set("limit", String(params.limit ?? 20))
  query.set("sortBy", params.sortBy ?? "createdAt")
  query.set("sortOrder", params.sortOrder ?? "desc")

  return apiFetch<LeadsListResponse>(`/leads?${query.toString()}`)
}

export function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<{ data: Lead }> {
  return apiFetch<{ data: Lead }>(`/leads/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}
