import { Schema, model } from "mongoose"

import { BUDGET_RANGES, LEAD_STATUSES, type BudgetRange, type LeadStatus } from "../types"

export interface LeadDocument {
  _id: Schema.Types.ObjectId
  name: string
  email: string
  budgetRange: BudgetRange
  message: string
  status: LeadStatus
  createdAt: Date
  updatedAt: Date
}

const leadSchema = new Schema<LeadDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    budgetRange: {
      type: String,
      required: true,
      enum: BUDGET_RANGES,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    status: {
      type: String,
      required: true,
      enum: LEAD_STATUSES,
      default: "New",
    },
  },
  { timestamps: true, strict: true }
)

leadSchema.index({ status: 1, createdAt: -1 })
leadSchema.index({ name: 1 })
leadSchema.index({ email: 1 })

export const Lead = model<LeadDocument>("Lead", leadSchema)
