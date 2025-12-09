import { int, mysqlEnum, mysqlTable, text, varchar, timestamp } from "drizzle-orm/mysql-core";

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
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull(), // Email is now required
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  /** Credits system */
  credits: int("credits").default(5).notNull(), // New users get 5 free credits
  subscriptionType: mysqlEnum("subscriptionType", ["free", "light", "premium", "monthly_unlimited", "annual_unlimited"]).default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"), // For unlimited plans
  /** Profile fields - optional except email */
  username: varchar("username", { length: 64 }), // Optional username
  phone: varchar("phone", { length: 20 }), // Optional phone number
  instagramHandle: varchar("instagramHandle", { length: 64 }), // Optional Instagram
  tiktokHandle: varchar("tiktokHandle", { length: 64 }), // Optional TikTok
  twitterHandle: varchar("twitterHandle", { length: 64 }), // Optional Twitter/X
  youtubeChannel: varchar("youtubeChannel", { length: 64 }), // Optional YouTube
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
  theme: mysqlEnum("theme", ["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon"]).notNull(),
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
 * Transformations table for storing generated images and their metadata.
 * Used for gallery, trending, and analytics.
 */
export const transformations = mysqlTable("transformations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  theme: mysqlEnum("theme", ["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon"]).notNull(),
  imageUrl: text("imageUrl").notNull(),
  averageRating: int("averageRating").default(0),
  ratingCount: int("ratingCount").default(0),
  isPublic: int("isPublic").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transformation = typeof transformations.$inferSelect;
export type InsertTransformation = typeof transformations.$inferInsert;


/**
 * Admin alerts table for tracking important events
 */
export const adminAlerts = mysqlTable("admin_alerts", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["new_user", "large_purchase", "error", "system", "custom"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  isRead: int("isRead").default(0).notNull(),
  relatedUserId: int("relatedUserId"), // Optional link to user
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminAlert = typeof adminAlerts.$inferSelect;
export type InsertAdminAlert = typeof adminAlerts.$inferInsert;

/**
 * Support tickets for admin communication
 */
export const supportTickets = mysqlTable("support_tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  adminResponse: text("adminResponse"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

/**
 * Access logs for analytics
 */
export const accessLogs = mysqlTable("access_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  page: varchar("page", { length: 255 }).notNull(),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccessLog = typeof accessLogs.$inferSelect;
export type InsertAccessLog = typeof accessLogs.$inferInsert;
