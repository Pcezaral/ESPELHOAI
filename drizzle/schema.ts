import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name").default(""),
  email: varchar("email", { length: 320 }).default(""),
  loginMethod: varchar("loginMethod", { length: 64 }).default(""),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Credits system */
  credits: int("credits").default(5).notNull(), // New users get 5 free credits
  subscriptionType: mysqlEnum("subscriptionType", ["free", "light", "premium", "monthly_unlimited", "annual_unlimited"]).default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"), // For unlimited plans
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Ratings table for user feedback on generated images.
 * Stores star ratings (1-5) and optional comments.
 */
export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  theme: mysqlEnum("theme", ["animals", "monster", "art", "gender", "epic", "gangster", "circus", "pet"]).notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;

/**
 * Credit transactions table for tracking credit usage and purchases.
 * Maintains audit trail of all credit-related operations.
 */
export const creditTransactions = mysqlTable("credit_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["initial", "purchase", "consumption", "bonus", "refund"]).notNull(),
  amount: int("amount").notNull(), // Positive for additions, negative for consumption
  balanceAfter: int("balanceAfter").notNull(), // Balance after this transaction
  description: text("description"), // e.g., "Generated Bichinho transformation", "Purchased Light package"
  relatedPackage: mysqlEnum("relatedPackage", ["light", "premium", "monthly_unlimited", "annual_unlimited"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

/**
 * Premium downloads table for tracking high-resolution image downloads.
 * Records downloads for products like t-shirts, mugs, and posters.
 */
export const premiumDownloads = mysqlTable("premium_downloads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  resolution: mysqlEnum("resolution", ["hd", "4k"]).notNull(),
  product: mysqlEnum("product", ["camiseta", "caneca", "poster"]).notNull(),
  theme: varchar("theme", { length: 64 }),
  creditsCost: int("creditsCost").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PremiumDownload = typeof premiumDownloads.$inferSelect;
export type InsertPremiumDownload = typeof premiumDownloads.$inferInsert;


/**
 * Transformation history table for storing user's recent transformations.
 * Keeps transformations for 5 days to allow users to revisit, download, and share.
 */
export const transformationHistory = mysqlTable("transformation_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  theme: mysqlEnum("theme", ["animals", "monster", "art", "gender", "epic", "gangster", "circus", "pet"]).notNull(),
  originalImageUrl: text("originalImageUrl").notNull(), // URL da imagem original
  transformedImageUrl: text("transformedImageUrl").notNull(), // URL da imagem transformada
  watermarkedImageUrl: text("watermarkedImageUrl"), // URL da imagem com marca d'água (para compartilhamento)
  beforeAfterImageUrl: text("beforeAfterImageUrl"), // URL da imagem antes/depois combinada
  isFavorite: int("isFavorite").default(0).notNull(), // 0 = não favorito, 1 = favorito (favoritos não expiram)
  expiresAt: timestamp("expiresAt").notNull(), // Data de expiração (5 dias após criação, null se favorito)
  notifiedExpiring: int("notifiedExpiring").default(0).notNull(), // 0 = não notificado, 1 = notificado sobre expiração
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TransformationHistory = typeof transformationHistory.$inferSelect;
export type InsertTransformationHistory = typeof transformationHistory.$inferInsert;
