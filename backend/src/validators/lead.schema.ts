import { z } from "zod"

import { BUDGET_RANGES, LEAD_STATUSES } from "../types"

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254),
  budgetRange: z.enum(BUDGET_RANGES as [string, ...string[]], {
    errorMap: () => ({ message: "Select a valid budget range" }),
  }),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
})

export const LEAD_SORT_FIELDS = ["name", "budgetRange", "createdAt"] as const

export const listLeadsQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(LEAD_SORT_FIELDS).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES as [string, ...string[]], {
    errorMap: () => ({ message: "Status must be one of New, Contacted, Closed" }),
  }),
})

export const leadIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid lead id"),
})
