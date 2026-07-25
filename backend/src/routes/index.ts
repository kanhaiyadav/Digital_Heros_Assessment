import { Router } from "express"

import authRoutes from "./auth.routes"
import leadsRoutes from "./leads.routes"

const router = Router()

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

router.use("/leads", leadsRoutes)
router.use("/auth", authRoutes)

export default router
