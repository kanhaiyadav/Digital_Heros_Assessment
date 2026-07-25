import { Router } from "express"

import * as leadsController from "../controllers/leads.controller"
import { requireAuth } from "../middleware/auth.middleware"
import { validate } from "../middleware/validate.middleware"
import {
  createLeadSchema,
  leadIdParamSchema,
  listLeadsQuerySchema,
  updateLeadStatusSchema,
} from "../validators/lead.schema"

const router = Router()

router.post("/", validate(createLeadSchema), leadsController.create)
router.get("/", requireAuth, validate(listLeadsQuerySchema, "query"), leadsController.list)
router.patch(
  "/:id/status",
  requireAuth,
  validate(leadIdParamSchema, "params"),
  validate(updateLeadStatusSchema),
  leadsController.updateStatus
)

export default router
