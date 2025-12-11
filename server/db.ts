import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transformations, creditTransactions, adminAlerts, supportTickets, oauthProviders, userBadges, analyticsData, promoCodes, promoCodeUsage, affiliates, affiliateClicks, socialShares, affiliatePayouts, downloadHistory, InsertDownloadHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  if (!user.email) {
    throw new Error("User email is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
      email: user.email,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Buscar transformações trending (mais bem avaliadas)
export async function getTrendingTransformations(limit: number = 6) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get trending: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(transformations)
      .where(eq(transformations.isPublic, 1))
      .orderBy(desc(transformations.averageRating), desc(transformations.ratingCount))
      .limit(limit);

    return result;
  } catch (error) {
    console.error("[Database] Failed to get trending:", error);
    return [];
  }
}

// TODO: add feature queries here as your schema grows.


// Admin Dashboard Queries

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;

  try {
    const totalUsers = await db.select().from(users);
    const totalTransformations = await db.select().from(transformations);
    const totalCreditsSpent = await db.select().from(creditTransactions);
    
    return {
      totalUsers: totalUsers.length,
      totalTransformations: totalTransformations.length,
      totalRevenue: totalCreditsSpent
        .filter(t => t.type === 'purchase')
        .reduce((sum, t) => sum + t.amount, 0),
      activeUsers: totalUsers.filter(u => {
        const lastSignedIn = new Date(u.lastSignedIn);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return lastSignedIn > thirtyDaysAgo;
      }).length,
    };
  } catch (error) {
    console.error("[Database] Failed to get admin stats:", error);
    return null;
  }
}

export async function getRecentAlerts(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  try {
    const { adminAlerts } = await import("../drizzle/schema");
    const result = await db
      .select()
      .from(adminAlerts)
      .orderBy(desc(adminAlerts.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get alerts:", error);
    return [];
  }
}

export async function getSupportTickets(status?: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    let query: any = db.select().from(supportTickets);
    
    if (status) {
      query = query.where(eq(supportTickets.status, status as any));
    }
    
    const result = await query.orderBy(desc(supportTickets.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get support tickets:", error);
    return [];
  }
}

export async function getUsersWithStats(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get users:", error);
    return [];
  }
}

export async function getTransactionHistory(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(creditTransactions)
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get transaction history:", error);
    return [];
  }
}

// OAuth Providers
export async function createOAuthProvider(userId: number, provider: string, providerUserId: string, providerUsername?: string, accessToken?: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(oauthProviders).values({
      userId,
      provider: provider as any,
      providerUserId,
      providerUsername,
      accessToken,
    });
  } catch (error) {
    console.error("[Database] Failed to create OAuth provider:", error);
  }
}

export async function getOAuthProviders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(oauthProviders).where(eq(oauthProviders.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get OAuth providers:", error);
    return [];
  }
}

// User Badges
export async function unlockBadge(userId: number, badgeType: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const existing = await db.select().from(userBadges).where(
      and(eq(userBadges.userId, userId), eq(userBadges.badgeType, badgeType as any))
    ).limit(1);

    if (existing.length > 0) return existing[0];

    await db.insert(userBadges).values({
      userId,
      badgeType: badgeType as any,
    });
  } catch (error) {
    console.error("[Database] Failed to unlock badge:", error);
  }
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(userBadges).where(eq(userBadges.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user badges:", error);
    return [];
  }
}

// Analytics
export async function recordAnalytics(date: string, theme: string, transformationCount: number, uniqueUsers: number, shareCount: number, downloadCount: number) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(analyticsData).values({
      date,
      theme: theme as any,
      transformationCount,
      uniqueUsers,
      shareCount,
      downloadCount,
    });
  } catch (error) {
    console.error("[Database] Failed to record analytics:", error);
  }
}

export async function getAnalyticsByDate(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(analyticsData).where(
      and(
        gte(analyticsData.date, startDate),
        lte(analyticsData.date, endDate)
      )
    );
  } catch (error) {
    console.error("[Database] Failed to get analytics:", error);
    return [];
  }
}


/**
 * Cleanup function to delete old transformation images (older than 24 hours)
 * This should be called periodically by a scheduled job
 * Note: This is a placeholder - implement with your actual S3 cleanup logic
 */
export async function cleanupOldTransformations() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot cleanup: database not available");
    return;
  }

  try {
    // Placeholder for cleanup logic
    // In production, you would:
    // 1. Query transformations older than 24 hours
    // 2. Delete associated S3 files
    // 3. Delete database records
    console.log("[Cleanup] Cleanup job scheduled - implement S3 deletion logic");
  } catch (error) {
    console.error("[Cleanup] Failed to cleanup old transformations:", error);
  }
}


// PROMO CODES / CUPONS

export async function validatePromoCode(code: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const now = new Date();
    const result = await db
      .select()
      .from(promoCodes)
      .where(
        and(
          eq(promoCodes.code, code.toUpperCase()),
          eq(promoCodes.isActive, 1),
          gte(promoCodes.validUntil, now),
          lte(promoCodes.validFrom, now)
        )
      )
      .limit(1);

    if (result.length === 0) return null;

    const promo = result[0];
    
    // Check if max uses reached
    if (promo.maxUses && promo.currentUses >= promo.maxUses) {
      return null;
    }

    return promo;
  } catch (error) {
    console.error("[Database] Failed to validate promo code:", error);
    return null;
  }
}

export async function usePromoCode(userId: number, promoCodeId: number, purchaseAmount: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const promo = await db.select().from(promoCodes).where(eq(promoCodes.id, promoCodeId)).limit(1);
    if (promo.length === 0) return null;

    const p = promo[0];
    let discountAmount = 0;

    if (p.discountType === 'percentage') {
      discountAmount = Math.floor(purchaseAmount * (p.discountValue / 100));
    } else {
      discountAmount = p.discountValue * 100; // Convert to cents
    }

    // Record usage
    await db.insert(promoCodeUsage).values({
      userId,
      promoCodeId,
      discountAmount,
      purchaseAmount,
    });

    // Increment usage count
    await db.update(promoCodes).set({
      currentUses: p.currentUses + 1,
    }).where(eq(promoCodes.id, promoCodeId));

    return discountAmount;
  } catch (error) {
    console.error("[Database] Failed to use promo code:", error);
    return null;
  }
}

// AFFILIATE PROGRAM

export async function createAffiliate(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Generate unique affiliate code
    const affiliateCode = `AFF_${userId}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const result = await db.insert(affiliates).values({
      userId,
      affiliateCode,
      commissionPercentage: 10, // Default 10%
    });

    return affiliateCode;
  } catch (error) {
    console.error("[Database] Failed to create affiliate:", error);
    return null;
  }
}

export async function getAffiliateByCode(affiliateCode: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.affiliateCode, affiliateCode))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get affiliate:", error);
    return null;
  }
}

export async function recordAffiliateClick(affiliateId: number, ipAddress: string, userAgent: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(affiliateClicks).values({
      affiliateId,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("[Database] Failed to record affiliate click:", error);
  }
}

export async function recordAffiliateConversion(affiliateClickId: number, userId: number, purchaseAmount: number, commissionPercentage: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const commissionEarned = Math.floor(purchaseAmount * (commissionPercentage / 100));

    // Update click record
    await db.update(affiliateClicks).set({
      converted: 1,
      clickedUserId: userId,
      conversionAmount: purchaseAmount,
      commissionEarned,
      convertedAt: new Date(),
    }).where(eq(affiliateClicks.id, affiliateClickId));

    // Update affiliate earnings
    const affiliate = await db.select().from(affiliates).where(eq(affiliateClicks.affiliateId, affiliateClickId)).limit(1);
    if (affiliate.length > 0) {
      await db.update(affiliates).set({
        totalEarnings: affiliate[0].totalEarnings + commissionEarned,
        totalReferrals: affiliate[0].totalReferrals + 1,
      }).where(eq(affiliates.id, affiliate[0].id));
    }
  } catch (error) {
    console.error("[Database] Failed to record affiliate conversion:", error);
  }
}

export async function getAffiliateStats(affiliateId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const affiliate = await db.select().from(affiliates).where(eq(affiliates.id, affiliateId)).limit(1);
    if (affiliate.length === 0) return null;

    const clicks = await db.select().from(affiliateClicks).where(eq(affiliateClicks.affiliateId, affiliateId));
    const conversions = clicks.filter(c => c.converted === 1);

    return {
      ...affiliate[0],
      totalClicks: clicks.length,
      totalConversions: conversions.length,
      conversionRate: clicks.length > 0 ? (conversions.length / clicks.length * 100).toFixed(2) : '0',
    };
  } catch (error) {
    console.error("[Database] Failed to get affiliate stats:", error);
    return null;
  }
}

// SOCIAL SHARES

export async function recordSocialShare(userId: number, transformationId: number, platform: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const shareUrl = `${process.env.VITE_APP_URL}/share/${transformationId}?platform=${platform}`;

    await db.insert(socialShares).values({
      userId,
      transformationId,
      platform: platform as any,
      shareUrl,
    });
  } catch (error) {
    console.error("[Database] Failed to record social share:", error);
  }
}

export async function getSocialShareStats(transformationId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const shares = await db
      .select()
      .from(socialShares)
      .where(eq(socialShares.transformationId, transformationId));

    return {
      totalShares: shares.length,
      byPlatform: {
        instagram: shares.filter(s => s.platform === 'instagram').length,
        tiktok: shares.filter(s => s.platform === 'tiktok').length,
        twitter: shares.filter(s => s.platform === 'twitter').length,
        facebook: shares.filter(s => s.platform === 'facebook').length,
        whatsapp: shares.filter(s => s.platform === 'whatsapp').length,
        telegram: shares.filter(s => s.platform === 'telegram').length,
      },
      totalClicks: shares.reduce((sum, s) => sum + s.clickCount, 0),
      totalConversions: shares.reduce((sum, s) => sum + s.conversionCount, 0),
    };
  } catch (error) {
    console.error("[Database] Failed to get social share stats:", error);
    return null;
  }
}

// AFFILIATE PAYOUTS

export async function createAffiliatePayout(affiliateId: number, amount: number, payoutMethod: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(affiliatePayouts).values({
      affiliateId,
      amount,
      payoutMethod: payoutMethod as any,
    });
  } catch (error) {
    console.error("[Database] Failed to create affiliate payout:", error);
  }
}

export async function getAffiliatePendingPayouts() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(affiliatePayouts)
      .where(eq(affiliatePayouts.status, 'pending'))
      .orderBy(desc(affiliatePayouts.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get pending payouts:", error);
    return [];
  }
}


// EMAIL AUTOMATION

export async function sendTransformationSummaryEmail(userId: number, userEmail: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const { emailHistory } = await import("../drizzle/schema");
    const recentTransformations = await db
      .select()
      .from(transformations)
      .where(eq(transformations.userId, userId))
      .limit(10);

    if (recentTransformations.length === 0) return;

    await db.insert(emailHistory).values({
      userId,
      type: "transformation_summary",
      subject: `Seu Resumo de Transformações - ${new Date().toLocaleDateString("pt-BR")}`,
      content: `Você gerou ${recentTransformations.length} transformações incríveis!`,
      status: "sent",
    });

    console.log(`[Email] Transformation summary sent to ${userEmail}`);
  } catch (error) {
    console.error("[Database] Failed to send transformation summary email:", error);
  }
}

// TRENDING TRANSFORMATIONS

export async function recordTrendingTransformation(
  transformationId: number,
  userId: number,
  theme: string,
  imageUrl: string,
  title?: string,
  description?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const { trendingTransformations } = await import("../drizzle/schema");
    await db.insert(trendingTransformations).values({
      transformationId,
      userId,
      theme: theme as any,
      imageUrl,
      title: title || `Transformação ${theme}`,
      description,
      isPublic: 1,
    });
  } catch (error) {
    console.error("[Database] Failed to record trending transformation:", error);
  }
}

export async function getTrendingTransformationsNew(limit: number = 12): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const { trendingTransformations } = await import("../drizzle/schema");
    return await db
      .select()
      .from(trendingTransformations)
      .where(eq(trendingTransformations.isPublic, 1))
      .orderBy(desc(trendingTransformations.shareCount))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get trending transformations:", error);
    return [];
  }
}

export async function incrementShareCount(transformationId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const { trendingTransformations } = await import("../drizzle/schema");
    const { sql } = await import("drizzle-orm");
    await db
      .update(trendingTransformations)
      .set({ shareCount: sql`shareCount + 1` })
      .where(eq(trendingTransformations.transformationId, transformationId));
  } catch (error) {
    console.error("[Database] Failed to increment share count:", error);
  }
}

// WHATSAPP SHARES

export async function recordWhatsappShare(
  userId: number,
  transformationId: number,
  phoneNumber?: string,
  message?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const { whatsappShares } = await import("../drizzle/schema");
    const shareUrl = `${process.env.VITE_APP_URL || "https://descubraeu.manus.space"}/share/${transformationId}?platform=whatsapp`;
    
    await db.insert(whatsappShares).values({
      userId,
      transformationId,
      phoneNumber,
      message,
      shareUrl,
      status: "pending",
    });
  } catch (error) {
    console.error("[Database] Failed to record WhatsApp share:", error);
  }
}

export async function getWhatsappShareStats(transformationId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const { whatsappShares } = await import("../drizzle/schema");
    const shares = await db
      .select()
      .from(whatsappShares)
      .where(eq(whatsappShares.transformationId, transformationId));

    return {
      totalShares: shares.length,
      sentShares: shares.filter(s => s.status === 'sent').length,
      failedShares: shares.filter(s => s.status === 'failed').length,
      clickedShares: shares.filter(s => s.clickedAt !== null).length,
    };
  } catch (error) {
    console.error("[Database] Failed to get WhatsApp share stats:", error);
    return null;
  }
}


/**
 * Registrar um download de alta resolução
 */
export async function recordDownload(download: InsertDownloadHistory): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record download: database not available");
    return;
  }

  try {
    await db.insert(downloadHistory).values(download);
  } catch (error) {
    console.error("[Database] Failed to record download:", error);
    throw error;
  }
}

/**
 * Obter histórico de downloads de um usuário
 */
export async function getUserDownloadHistory(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get download history: database not available");
    return [];
  }

  try {
    const downloads = await db
      .select()
      .from(downloadHistory)
      .where(eq(downloadHistory.userId, userId))
      .orderBy(desc(downloadHistory.downloadedAt))
      .limit(limit);
    
    return downloads;
  } catch (error) {
    console.error("[Database] Failed to get download history:", error);
    return [];
  }
}

/**
 * Contar total de downloads de um usuário
 */
export async function getUserDownloadCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get download count: database not available");
    return 0;
  }

  try {
    const result = await db
      .select({ count: downloadHistory.id })
      .from(downloadHistory)
      .where(eq(downloadHistory.userId, userId));
    
    return result.length > 0 ? result.length : 0;
  } catch (error) {
    console.error("[Database] Failed to get download count:", error);
    return 0;
  }
}

/**
 * Obter estatísticas de downloads por resolução
 */
export async function getUserDownloadStats(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get download stats: database not available");
    return { totalDownloads: 0, hdDownloads: 0, k4Downloads: 0, totalCreditsCost: 0 };
  }

  try {
    const downloads = await db
      .select()
      .from(downloadHistory)
      .where(eq(downloadHistory.userId, userId));
    
    const hdDownloads = downloads.filter(d => d.resolution === 'hd').length;
    const k4Downloads = downloads.filter(d => d.resolution === '4k').length;
    const totalCreditsCost = downloads.reduce((sum, d) => sum + d.creditsCost, 0);
    
    return {
      totalDownloads: downloads.length,
      hdDownloads,
      k4Downloads,
      totalCreditsCost,
    };
  } catch (error) {
    console.error("[Database] Failed to get download stats:", error);
    return { totalDownloads: 0, hdDownloads: 0, k4Downloads: 0, totalCreditsCost: 0 };
  }
}
