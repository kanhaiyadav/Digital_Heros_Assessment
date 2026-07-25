import bcrypt from "bcrypt"

import { AdminUser } from "../models/AdminUser"
import { RefreshToken } from "../models/RefreshToken"
import { ApiError } from "../utils/ApiError"
import {
  hashToken,
  newJti,
  refreshExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./token.service"

interface AuthTokens {
  accessToken: string
  refreshToken: string
  admin: { id: string; email: string; name: string }
}

async function issueTokens(admin: { id: string; email: string; name: string }): Promise<AuthTokens> {
  const jti = newJti()
  const refreshToken = signRefreshToken({ sub: admin.id, jti })

  await RefreshToken.create({
    admin: admin.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshExpiryDate(),
  })

  const accessToken = signAccessToken({ sub: admin.id, email: admin.email })

  return { accessToken, refreshToken, admin }
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const admin = await AdminUser.findOne({ email }).select("+passwordHash")

  if (!admin) {
    throw ApiError.unauthorized("Invalid email or password")
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash)

  if (!passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password")
  }

  return issueTokens({ id: admin._id.toString(), email: admin.email, name: admin.name })
}

export async function refresh(rawRefreshToken: string): Promise<AuthTokens> {
  let payload
  try {
    payload = verifyRefreshToken(rawRefreshToken)
  } catch {
    throw ApiError.unauthorized("Session expired, please log in again")
  }

  const tokenHash = hashToken(rawRefreshToken)
  const stored = await RefreshToken.findOne({ admin: payload.sub, tokenHash })

  if (!stored || stored.expiresAt < new Date()) {
    throw ApiError.unauthorized("Session expired, please log in again")
  }

  if (stored.revokedAt) {
    // Reuse of a rotated-out token indicates possible theft - burn every session for this admin.
    await RefreshToken.updateMany({ admin: payload.sub, revokedAt: { $exists: false } }, { revokedAt: new Date() })
    throw ApiError.unauthorized("Session expired, please log in again")
  }

  const admin = await AdminUser.findById(payload.sub)

  if (!admin) {
    throw ApiError.unauthorized("Session expired, please log in again")
  }

  stored.revokedAt = new Date()
  await stored.save()

  return issueTokens({ id: admin._id.toString(), email: admin.email, name: admin.name })
}

export async function logout(rawRefreshToken: string | undefined): Promise<void> {
  if (!rawRefreshToken) {
    return
  }

  const tokenHash = hashToken(rawRefreshToken)
  await RefreshToken.updateOne({ tokenHash, revokedAt: { $exists: false } }, { revokedAt: new Date() })
}
