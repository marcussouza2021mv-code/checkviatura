import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core"

/**
 * Contas do Mercado Livre conectadas via OAuth.
 * Indexadas pelo user_id retornado pelo próprio Mercado Livre.
 */
export const mlAccounts = pgTable("ml_accounts", {
  mlUserId: bigint("ml_user_id", { mode: "number" }).primaryKey(),
  nickname: text("nickname"),
  email: text("email"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  scope: text("scope"),
  tokenType: text("token_type"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type MLAccount = typeof mlAccounts.$inferSelect
