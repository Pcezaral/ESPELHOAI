import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

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
  subscriptionType: mysqlEnum("subscriptionType", ["free", "credits_50", "credits_200", "credits_500", "credits_1000"]).default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"), // DEPRECATED: Unlimited plans removed
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
  relatedPackage: mysqlEnum("relatedPackage", ["credits_50", "credits_200", "credits_500", "credits_1000"]),
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
 * Premium downloads for high-resolution images
 */
export const premiumDownloads = mysqlTable("premium_downloads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  resolution: mysqlEnum("resolution", ["hd", "4k"]).notNull(),
  product: mysqlEnum("product", ["camiseta", "caneca", "poster"]).notNull(),
  theme: varchar("theme", { length: 64 }).notNull(),
  creditsCost: int("creditsCost").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PremiumDownload = typeof premiumDownloads.$inferSelect;
export type InsertPremiumDownload = typeof premiumDownloads.$inferInsert;

/**
 * Referral program tracking
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referredId: int("referredId").notNull(),
  creditsAwarded: int("creditsAwarded").default(5).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "expired"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

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
 * Promo codes / Coupons for discounts
 */
export const promoCodes = mysqlTable("promo_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: mysqlEnum("discountType", ["percentage", "fixed_credits"]).notNull(),
  discountValue: int("discountValue").notNull(), // Percentage (1-100) or fixed credits
  maxUses: int("maxUses"), // NULL = unlimited
  currentUses: int("currentUses").default(0).notNull(),
  minPurchaseAmount: int("minPurchaseAmount").default(0).notNull(), // In cents
  validFrom: timestamp("validFrom").notNull(),
  validUntil: timestamp("validUntil").notNull(),
  isActive: int("isActive").default(1).notNull(),
  description: text("description"), // e.g., "Black Friday 30% OFF"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = typeof promoCodes.$inferInsert;

/**
 * Promo code usage tracking
 */
export const promoCodeUsage = mysqlTable("promo_code_usage", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  promoCodeId: int("promoCodeId").notNull(),
  discountAmount: int("discountAmount").notNull(), // In cents
  purchaseAmount: int("purchaseAmount").notNull(), // In cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromoCodeUsage = typeof promoCodeUsage.$inferSelect;
export type InsertPromoCodeUsage = typeof promoCodeUsage.$inferInsert;

/**
 * Affiliate program tracking
 */
export const affiliates = mysqlTable("affiliates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  affiliateCode: varchar("affiliateCode", { length: 50 }).notNull().unique(),
  commissionPercentage: int("commissionPercentage").default(10).notNull(), // 10% default
  totalEarnings: int("totalEarnings").default(0).notNull(), // In cents
  totalReferrals: int("totalReferrals").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  bankAccount: varchar("bankAccount", { length: 255 }), // For payouts
  bankCode: varchar("bankCode", { length: 10 }),
  cpf: varchar("cpf", { length: 20 }), // For Brazilian bank transfers
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type InsertAffiliate = typeof affiliates.$inferInsert;

/**
 * Affiliate clicks and conversions
 */
export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  clickedUserId: int("clickedUserId"), // NULL if not yet registered
  referralUrl: text("referralUrl"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  converted: int("converted").default(0).notNull(), // 1 if user made a purchase
  conversionAmount: int("conversionAmount"), // In cents, NULL if not converted
  commissionEarned: int("commissionEarned"), // In cents, calculated on conversion
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  convertedAt: timestamp("convertedAt"),
});

export type AffiliateClick = typeof affiliateClicks.$inferSelect;
export type InsertAffiliateClick = typeof affiliateClicks.$inferInsert;

/**
 * Social media shares tracking
 */
export const socialShares = mysqlTable("social_shares", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transformationId: int("transformationId").notNull(),
  platform: mysqlEnum("platform", ["instagram", "tiktok", "twitter", "facebook", "whatsapp", "telegram"]).notNull(),
  shareUrl: text("shareUrl"),
  clickCount: int("clickCount").default(0).notNull(),
  conversionCount: int("conversionCount").default(0).notNull(), // How many clicked and registered
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialShare = typeof socialShares.$inferSelect;
export type InsertSocialShare = typeof socialShares.$inferInsert;

/**
 * Affiliate payouts
 */
export const affiliatePayouts = mysqlTable("affiliate_payouts", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId").notNull(),
  amount: int("amount").notNull(), // In cents
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  payoutMethod: mysqlEnum("payoutMethod", ["pix", "bank_transfer", "paypal"]).notNull(),
  transactionId: varchar("transactionId", { length: 255 }), // For tracking
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

export type AffiliatePayout = typeof affiliatePayouts.$inferSelect;
export type InsertAffiliatePayout = typeof affiliatePayouts.$inferInsert;


/**
 * Email history - track sent emails to users
 */
export const emailHistory = mysqlTable("email_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["transformation_summary", "trending_alert", "promotional", "account_activity"]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["sent", "failed", "bounced"]).default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
});

export type EmailHistory = typeof emailHistory.$inferSelect;
export type InsertEmailHistory = typeof emailHistory.$inferInsert;

/**
 * Trending transformations - track popular transformations
 */
export const trendingTransformations = mysqlTable("trending_transformations", {
  id: int("id").autoincrement().primaryKey(),
  transformationId: int("transformationId").notNull(),
  userId: int("userId").notNull(),
  theme: mysqlEnum("theme", ["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon"]).notNull(),
  imageUrl: text("imageUrl").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  shareCount: int("shareCount").default(0).notNull(),
  downloadCount: int("downloadCount").default(0).notNull(),
  ratingScore: int("ratingScore").default(0).notNull(), // Average rating
  isPublic: int("isPublic").default(1).notNull(), // 1 = public, 0 = private
  featuredAt: timestamp("featuredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrendingTransformation = typeof trendingTransformations.$inferSelect;
export type InsertTrendingTransformation = typeof trendingTransformations.$inferInsert;

/**
 * WhatsApp shares - track WhatsApp sharing
 */
export const whatsappShares = mysqlTable("whatsapp_shares", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transformationId: int("transformationId").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  message: text("message"),
  shareUrl: text("shareUrl"),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  clickedAt: timestamp("clickedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WhatsappShare = typeof whatsappShares.$inferSelect;
export type InsertWhatsappShare = typeof whatsappShares.$inferInsert;


/**
 * Push Notifications - Rastreia notificações enviadas aos usuários
 */
export const pushNotifications = mysqlTable("push_notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", ["trending", "download_ready", "promotion", "general"]).notNull(),
  relatedTransformationId: int("relatedTransformationId"), // ID da transformação se for trending
  read: boolean("read").default(false).notNull(),
  clickedAt: timestamp("clickedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushNotification = typeof pushNotifications.$inferSelect;
export type InsertPushNotification = typeof pushNotifications.$inferInsert;

/**
 * Download History - Histórico de downloads de alta resolução
 */
export const downloadHistory = mysqlTable("download_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transformationId: int("transformationId").notNull(),
  imageUrl: text("imageUrl").notNull(),
  resolution: mysqlEnum("resolution", ["hd", "4k"]).notNull(),
  product: mysqlEnum("product", ["camiseta", "caneca", "poster"]).notNull(),
  theme: varchar("theme", { length: 64 }).notNull(),
  creditsCost: int("creditsCost").notNull(),
  downloadedAt: timestamp("downloadedAt").defaultNow().notNull(),
  fileSize: int("fileSize"), // Tamanho do arquivo em bytes
  downloadStatus: mysqlEnum("downloadStatus", ["pending", "completed", "failed"]).default("pending").notNull(),
});

export type DownloadHistory = typeof downloadHistory.$inferSelect;
export type InsertDownloadHistory = typeof downloadHistory.$inferInsert;

/**
 * User Push Subscriptions - Armazena endpoints de push notifications
 */
export const userPushSubscriptions = mysqlTable("user_push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  endpoint: varchar("endpoint", { length: 1024 }).notNull(),
  auth: varchar("auth", { length: 255 }).notNull(),
  p256dh: varchar("p256dh", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPushSubscription = typeof userPushSubscriptions.$inferSelect;
export type InsertUserPushSubscription = typeof userPushSubscriptions.$inferInsert;

export const pwaInstalls = mysqlTable("pwa_installs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: mysqlEnum("platform", ["android", "ios", "desktop"]).notNull(),
  userAgent: text("userAgent"),
  bonusCreditsAwarded: int("bonusCreditsAwarded").default(5).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PwaInstall = typeof pwaInstalls.$inferSelect;
export type InsertPwaInstall = typeof pwaInstalls.$inferInsert;
