import { Router } from "express"

import * as authController from "../controllers/auth.controller"
import { requireAuth } from "../middleware/auth.middleware"
import { loginLimiter } from "../middleware/rateLimit.middleware"
import { validate } from "../middleware/validate.middleware"
import { loginSchema } from "../validators/auth.schema"

const router = Router()

router.post("/login", loginLimiter, validate(loginSchema), authController.login)
router.post("/refresh", authController.refresh)
router.post("/logout", requireAuth, authController.logout)
router.get("/me", requireAuth, authController.me)

export default router
