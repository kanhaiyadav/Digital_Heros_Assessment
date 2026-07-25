import { Schema, model, Types } from "mongoose"

export interface RefreshTokenDocument {
  _id: Schema.Types.ObjectId
  admin: Types.ObjectId
  tokenHash: string
  expiresAt: Date
  revokedAt?: Date
  createdAt: Date
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, strict: true }
)

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const RefreshToken = model<RefreshTokenDocument>("RefreshToken", refreshTokenSchema)
