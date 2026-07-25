import type { Request, Response } from "express"

import { AdminUser } from "../models/AdminUser"
import * as authService from "../services/auth.service"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import { REFRESH_TOKEN_COOKIE, clearAuthCookies, setAuthCookies } from "../utils/cookies"

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string }

  const { accessToken, refreshToken, admin } = await authService.login(email, password)

  setAuthCookies(res, accessToken, refreshToken)
  res.status(200).json({ data: admin })
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE]

  if (!rawRefreshToken) {
    throw ApiError.unauthorized("Not authenticated")
  }

  const { accessToken, refreshToken, admin } = await authService.refresh(rawRefreshToken)

  setAuthCookies(res, accessToken, refreshToken)
  res.status(200).json({ data: admin })
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE]

  await authService.logout(rawRefreshToken)
  clearAuthCookies(res)
  res.status(204).send()
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  const admin = await AdminUser.findById(req.user?.sub)

  if (!admin) {
    throw ApiError.unauthorized("Not authenticated")
  }

  res.status(200).json({ data: { id: admin._id.toString(), email: admin.email, name: admin.name } })
})
