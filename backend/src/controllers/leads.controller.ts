import type { Request, Response } from "express"

import * as leadService from "../services/lead.service"
import { asyncHandler } from "../utils/asyncHandler"
import type { listLeadsQuerySchema } from "../validators/lead.schema"
import type { z } from "zod"

export const create = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.createLead(req.body)
  res.status(201).json({ data: lead })
})

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const query = res.locals.query as z.infer<typeof listLeadsQuerySchema>
  const result = await leadService.listLeads(query)
  res.status(200).json(result)
})

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body as { status: string }

  const lead = await leadService.updateLeadStatus(id, status)
  res.status(200).json({ data: lead })
})
