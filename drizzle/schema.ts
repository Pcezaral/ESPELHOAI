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

/**
 * OAuth providers for social login
 */
export const oauthProviders = mysqlTable("oauth_providers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  provider: mysqlEnum("provider", ["instagram", "tiktok", "twitter", "youtube"]).notNull(),
  providerUserId: varchar("providerUserId", { length: 255 }).notNull(),
  providerUsername: varchar("providerUsername", { length: 255 }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OAuthProvider = typeof oauthProviders.$inferSelect;
export type InsertOAuthProvider = typeof oauthProviders.$inferInsert;

/**
 * User badges and achievements
 */
export const userBadges = mysqlTable("user_badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeType: mysqlEnum("badgeType", ["transformations_10", "transformations_50", "transformations_100", "social_sharer", "early_adopter", "power_user", "collector"]).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

/**
 * Analytics data for dashboard
 */
export const analyticsData = mysqlTable("analytics_data", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(),
  theme: mysqlEnum("theme", ["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon"]).notNull(),
  transformationCount: int("transformationCount").default(0).notNull(),
  uniqueUsers: int("uniqueUsers").default(0).notNull(),
  shareCount: int("shareCount").default(0).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsData = typeof analyticsData.$inferSelect;
export type InsertAnalyticsData = typeof analyticsData.$inferInsert;


/**
 * Subscription plans with tiered pricing and limits
 */
export const subscriptionPlans = mysqlTable("subscription_plans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  displayName: varchar("displayName", { length: 100 }).notNull(),
  monthlyPrice: int("monthlyPrice").notNull(),
  transformationsPerMonth: int("transformationsPerMonth").notNull(),
  maxExtraCredits: int("maxExtraCredits").notNull(),
  extraCreditPrice: int("extraCreditPrice").notNull(),
  includesHDDownload: int("includesHDDownload").default(0).notNull(),
  includes4KDownload: int("includes4KDownload").default(0).notNull(),
  supportLevel: mysqlEnum("supportLevel", ["email", "priority", "vip"]).default("email").notNull(),
  hasAPI: int("hasAPI").default(0).notNull(),
  hasWebhooks: int("hasWebhooks").default(0).notNull(),
  renewalBonus: int("renewalBonus").default(0).notNull(),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * User subscriptions tracking
 */
export const userSubscriptions = mysqlTable("user_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planId: int("planId").notNull(),
  status: mysqlEnum("status", ["active", "paused", "cancelled", "expired"]).default("active").notNull(),
  startDate: timestamp("startDate").defaultNow().notNull(),
  renewalDate: timestamp("renewalDate").notNull(),
  transformationsUsedThisMonth: int("transformationsUsedThisMonth").default(0).notNull(),
  extraCreditsUsed: int("extraCreditsUsed").default(0).notNull(),
  autoRenew: int("autoRenew").default(1).notNull(),
  cancellationReason: text("cancellationReason"),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Abuse detection and monitoring
 */
export const abuseReports = mysqlTable("abuse_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  abuseScore: int("abuseScore").notNull(),
  indicators: text("indicators").notNull(),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high"]).notNull(),
  status: mysqlEnum("status", ["active", "warned", "suspended", "resolved"]).default("active").notNull(),
  actionTaken: varchar("actionTaken", { length: 100 }),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AbuseReport = typeof abuseReports.$inferSelect;
export type InsertAbuseReport = typeof abuseReports.$inferInsert;

/**
 * User behavior metrics for abuse detection
 */
export const userBehaviorMetrics = mysqlTable("user_behavior_metrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  transformationsCount: int("transformationsCount").default(0).notNull(),
  uniqueStylesUsed: int("uniqueStylesUsed").default(0).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  downloadRatio: int("downloadRatio").default(0).notNull(),
  ipAddresses: text("ipAddresses"),
  userAgents: text("userAgents"),
  suspiciousKeywordsInBio: int("suspiciousKeywordsInBio").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserBehaviorMetrics = typeof userBehaviorMetrics.$inferSelect;
export type InsertUserBehaviorMetrics = typeof userBehaviorMetrics.$inferInsert;


/**
 * High Resolution Downloads - Rastreamento de downloads premium
 * Usuários podem fazer download de imagens em alta resolução (HD ou 4K)
 * Cada download consome créditos
 */
export const highResolutionDownloads = mysqlTable("high_resolution_downloads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  theme: varchar("theme", { length: 64 }).notNull(),
  resolution: mysqlEnum("resolution", ["hd", "4k"]).notNull(),
  creditsUsed: int("creditsUsed").notNull(),
  downloadUrl: text("downloadUrl"),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HighResolutionDownload = typeof highResolutionDownloads.$inferSelect;
export type InsertHighResolutionDownload = typeof highResolutionDownloads.$inferInsert;
