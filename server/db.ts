import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transformations, creditTransactions, adminAlerts, supportTickets } from "../drizzle/schema";
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
