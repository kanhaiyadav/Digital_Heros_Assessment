// keep in sync with backend/src/validators/lead.schema.ts
import { z } from "zod"

export const BUDGET_RANGES = ["<5k", "5k-15k", "15k-50k", "50k+"] as const
export type BudgetRange = (typeof BUDGET_RANGES)[number]

export const LEAD_STATUSES = ["New", "Contacted", "Closed"] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const LEAD_SORT_FIELDS = ["name", "budgetRange", "createdAt"] as const
export type LeadSortField = (typeof LEAD_SORT_FIELDS)[number]

export type SortOrder = "asc" | "desc"

export const budgetRangeLabels: Record<BudgetRange, string> = {
  "<5k": "Under $5k",
  "5k-15k": "$5k - $15k",
  "15k-50k": "$15k - $50k",
  "50k+": "$50k+",
}

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(254),
  budgetRange: z.enum(BUDGET_RANGES, "Select a budget range"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>

export interface Lead {
  _id: string
  name: string
  email: string
  budgetRange: BudgetRange
  message: string
  status: LeadStatus
  createdAt: string
  updatedAt: string
}
