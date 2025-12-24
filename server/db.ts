import { eq, desc, gt, lt, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transformationHistory, InsertTransformationHistory, TransformationHistory } from "../drizzle/schema";
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

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    // SEMPRE definir valores padrão para evitar erro "Field doesn't have a default value"
    const values: InsertUser = {
      openId: user.openId,
      name: user.name ?? "",
      email: user.email ?? "",
      loginMethod: user.loginMethod ?? "",
      lastSignedIn: user.lastSignedIn ?? new Date(),
    };
    
    const updateSet: Record<string, unknown> = {
      name: values.name,
      email: values.email,
      loginMethod: values.loginMethod,
      lastSignedIn: values.lastSignedIn,
    };

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    console.log("[Database] Upserting user:", { openId: user.openId, name: values.name, email: values.email });

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
    
    console.log("[Database] User upserted successfully");
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

// ==================== TRANSFORMAÇÕES HISTÓRICO ====================

/**
 * Salva uma transformação no histórico do usuário.
 * A transformação expira após 5 dias.
 */
export async function saveTransformationToHistory(
  userId: number,
  theme: InsertTransformationHistory["theme"],
  originalImageUrl: string,
  transformedImageUrl: string,
  watermarkedImageUrl?: string,
  beforeAfterImageUrl?: string
): Promise<TransformationHistory | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save transformation: database not available");
    return null;
  }

  try {
    // Calcular data de expiração (5 dias a partir de agora)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5);

    const values: InsertTransformationHistory = {
      userId,
      theme,
      originalImageUrl,
      transformedImageUrl,
      watermarkedImageUrl: watermarkedImageUrl || null,
      beforeAfterImageUrl: beforeAfterImageUrl || null,
      expiresAt,
    };

    const result = await db.insert(transformationHistory).values(values);
    const insertId = result[0].insertId;

    console.log("[Database] Transformation saved to history, id:", insertId);

    // Buscar e retornar o registro inserido
    const inserted = await db
      .select()
      .from(transformationHistory)
      .where(eq(transformationHistory.id, insertId))
      .limit(1);

    return inserted[0] || null;
  } catch (error) {
    console.error("[Database] Failed to save transformation to history:", error);
    return null;
  }
}

/**
 * Busca o histórico de transformações do usuário (não expiradas).
 * Retorna as transformações mais recentes primeiro.
 */
export async function getUserTransformationHistory(
  userId: number,
  limit: number = 20
): Promise<TransformationHistory[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get transformation history: database not available");
    return [];
  }

  try {
    const now = new Date();
    const history = await db
      .select()
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.userId, userId),
          gt(transformationHistory.expiresAt, now)
        )
      )
      .orderBy(desc(transformationHistory.createdAt))
      .limit(limit);

    console.log(`[Database] Found ${history.length} transformations for user ${userId}`);
    return history;
  } catch (error) {
    console.error("[Database] Failed to get transformation history:", error);
    return [];
  }
}

/**
 * Busca uma transformação específica pelo ID.
 */
export async function getTransformationById(
  transformationId: number,
  userId: number
): Promise<TransformationHistory | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get transformation: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.id, transformationId),
          eq(transformationHistory.userId, userId)
        )
      )
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get transformation:", error);
    return null;
  }
}

/**
 * Atualiza URLs adicionais de uma transformação (watermark, before/after).
 */
export async function updateTransformationUrls(
  transformationId: number,
  userId: number,
  updates: {
    watermarkedImageUrl?: string;
    beforeAfterImageUrl?: string;
  }
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update transformation: database not available");
    return false;
  }

  try {
    await db
      .update(transformationHistory)
      .set(updates)
      .where(
        and(
          eq(transformationHistory.id, transformationId),
          eq(transformationHistory.userId, userId)
        )
      );

    console.log("[Database] Transformation updated:", transformationId);
    return true;
  } catch (error) {
    console.error("[Database] Failed to update transformation:", error);
    return false;
  }
}

/**
 * Remove transformações expiradas (limpeza automática).
 * Pode ser chamada periodicamente.
 */
export async function cleanupExpiredTransformations(): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot cleanup transformations: database not available");
    return 0;
  }

  try {
    // Usar SQL raw para comparar com NOW()
    const result = await db
      .delete(transformationHistory)
      .where(lt(transformationHistory.expiresAt, sql`NOW()`));

    const deletedCount = result[0].affectedRows || 0;
    console.log(`[Database] Cleaned up ${deletedCount} expired transformations`);
    return deletedCount;
  } catch (error) {
    console.error("[Database] Failed to cleanup expired transformations:", error);
    return 0;
  }
}


// ==================== FAVORITOS ====================

/**
 * Marca/desmarca uma transformação como favorita.
 * Favoritos não expiram (expiresAt é estendido para 10 anos).
 */
export async function toggleTransformationFavorite(
  transformationId: number,
  userId: number,
  isFavorite: boolean
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot toggle favorite: database not available");
    return false;
  }

  try {
    // Se marcando como favorito, estender expiração para 10 anos
    // Se desmarcando, voltar para 5 dias a partir de agora
    const newExpiresAt = new Date();
    if (isFavorite) {
      newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 10);
    } else {
      newExpiresAt.setDate(newExpiresAt.getDate() + 5);
    }

    await db
      .update(transformationHistory)
      .set({
        isFavorite: isFavorite ? 1 : 0,
        expiresAt: newExpiresAt,
      })
      .where(
        and(
          eq(transformationHistory.id, transformationId),
          eq(transformationHistory.userId, userId)
        )
      );

    console.log(`[Database] Transformation ${transformationId} favorite set to ${isFavorite}`);
    return true;
  } catch (error) {
    console.error("[Database] Failed to toggle favorite:", error);
    return false;
  }
}

/**
 * Busca apenas as transformações favoritas do usuário.
 */
export async function getUserFavoriteTransformations(
  userId: number,
  limit: number = 50
): Promise<TransformationHistory[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get favorites: database not available");
    return [];
  }

  try {
    const favorites = await db
      .select()
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.userId, userId),
          eq(transformationHistory.isFavorite, 1)
        )
      )
      .orderBy(desc(transformationHistory.createdAt))
      .limit(limit);

    console.log(`[Database] Found ${favorites.length} favorite transformations for user ${userId}`);
    return favorites;
  } catch (error) {
    console.error("[Database] Failed to get favorites:", error);
    return [];
  }
}

/**
 * Busca transformações filtradas por tema.
 */
export async function getUserTransformationsByTheme(
  userId: number,
  theme: InsertTransformationHistory["theme"],
  limit: number = 20
): Promise<TransformationHistory[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get transformations by theme: database not available");
    return [];
  }

  try {
    const now = new Date();
    const history = await db
      .select()
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.userId, userId),
          eq(transformationHistory.theme, theme),
          gt(transformationHistory.expiresAt, now)
        )
      )
      .orderBy(desc(transformationHistory.createdAt))
      .limit(limit);

    console.log(`[Database] Found ${history.length} ${theme} transformations for user ${userId}`);
    return history;
  } catch (error) {
    console.error("[Database] Failed to get transformations by theme:", error);
    return [];
  }
}

// ==================== NOTIFICAÇÕES DE EXPIRAÇÃO ====================

/**
 * Busca transformações que vão expirar em 1 dia e ainda não foram notificadas.
 */
export async function getExpiringTransformations(
  userId: number
): Promise<TransformationHistory[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get expiring transformations: database not available");
    return [];
  }

  try {
    const now = new Date();
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    // Buscar transformações que expiram nas próximas 24 horas
    // e que não são favoritas e não foram notificadas ainda
    const expiring = await db
      .select()
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.userId, userId),
          eq(transformationHistory.isFavorite, 0),
          eq(transformationHistory.notifiedExpiring, 0),
          gt(transformationHistory.expiresAt, now),
          lt(transformationHistory.expiresAt, oneDayFromNow)
        )
      )
      .orderBy(desc(transformationHistory.createdAt));

    console.log(`[Database] Found ${expiring.length} expiring transformations for user ${userId}`);
    return expiring;
  } catch (error) {
    console.error("[Database] Failed to get expiring transformations:", error);
    return [];
  }
}

/**
 * Marca transformações como notificadas sobre expiração.
 */
export async function markTransformationsAsNotified(
  transformationIds: number[]
): Promise<boolean> {
  const db = await getDb();
  if (!db || transformationIds.length === 0) {
    return false;
  }

  try {
    for (const id of transformationIds) {
      await db
        .update(transformationHistory)
        .set({ notifiedExpiring: 1 })
        .where(eq(transformationHistory.id, id));
    }

    console.log(`[Database] Marked ${transformationIds.length} transformations as notified`);
    return true;
  } catch (error) {
    console.error("[Database] Failed to mark transformations as notified:", error);
    return false;
  }
}

/**
 * Conta quantas transformações o usuário tem por status.
 */
export async function getTransformationCounts(
  userId: number
): Promise<{ total: number; favorites: number; expiringSoon: number }> {
  const db = await getDb();
  if (!db) {
    return { total: 0, favorites: 0, expiringSoon: 0 };
  }

  try {
    const now = new Date();
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

    // Total não expirado
    const totalResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.userId, userId),
          gt(transformationHistory.expiresAt, now)
        )
      );

    // Favoritos
    const favoritesResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.userId, userId),
          eq(transformationHistory.isFavorite, 1)
        )
      );

    // Expirando em breve (próximas 24h, não favoritos)
    const expiringResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(transformationHistory)
      .where(
        and(
          eq(transformationHistory.userId, userId),
          eq(transformationHistory.isFavorite, 0),
          gt(transformationHistory.expiresAt, now),
          lt(transformationHistory.expiresAt, oneDayFromNow)
        )
      );

    return {
      total: Number(totalResult[0]?.count || 0),
      favorites: Number(favoritesResult[0]?.count || 0),
      expiringSoon: Number(expiringResult[0]?.count || 0),
    };
  } catch (error) {
    console.error("[Database] Failed to get transformation counts:", error);
    return { total: 0, favorites: 0, expiringSoon: 0 };
  }
}
