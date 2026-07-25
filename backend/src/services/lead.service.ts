import { FilterQuery } from "mongoose"

import { Lead, type LeadDocument } from "../models/Lead"
import { ApiError } from "../utils/ApiError"
import { BUDGET_RANGES } from "../types"
import type { LEAD_SORT_FIELDS } from "../validators/lead.schema"

export interface CreateLeadInput {
  name: string
  email: string
  budgetRange: string
  message: string
}

export interface ListLeadsInput {
  search?: string
  status?: string
  page: number
  limit: number
  sortBy: (typeof LEAD_SORT_FIELDS)[number]
  sortOrder: "asc" | "desc"
}

export interface ListLeadsResult {
  data: LeadDocument[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export async function createLead(input: CreateLeadInput): Promise<LeadDocument> {
  return Lead.create(input)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// budgetRange is a bounded enum, not a naturally sortable string ("15k-50k" < "50k+"
// alphabetically is wrong) - project its rank in BUDGET_RANGES and sort on that instead.
const SORT_KEY: Record<ListLeadsInput["sortBy"], string> = {
  name: "name",
  budgetRange: "budgetRangeOrder",
  createdAt: "createdAt",
}

export async function listLeads(input: ListLeadsInput): Promise<ListLeadsResult> {
  const filter: FilterQuery<LeadDocument> = {}

  if (input.status) {
    filter.status = input.status
  }

  if (input.search) {
    const pattern = new RegExp(escapeRegExp(input.search), "i")
    filter.$or = [{ name: pattern }, { email: pattern }, { message: pattern }]
  }

  const skip = (input.page - 1) * input.limit
  const sortDir = input.sortOrder === "asc" ? 1 : -1

  const [result] = await Lead.aggregate<{
    data: LeadDocument[]
    totalCount: { count: number }[]
  }>([
    { $match: filter },
    { $addFields: { budgetRangeOrder: { $indexOfArray: [BUDGET_RANGES, "$budgetRange"] } } },
    { $sort: { [SORT_KEY[input.sortBy]]: sortDir, _id: 1 } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: input.limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]).collation({ locale: "en", strength: 2 })

  const total = result?.totalCount[0]?.count ?? 0

  return {
    data: result?.data ?? [],
    meta: {
      total,
      page: input.page,
      limit: input.limit,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
    },
  }
}

export async function updateLeadStatus(id: string, status: string): Promise<LeadDocument> {
  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })

  if (!lead) {
    throw ApiError.notFound("Lead not found")
  }

  return lead
}
