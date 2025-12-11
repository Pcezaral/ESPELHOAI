import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users, creditTransactions } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

/**
 * Check if user has unlimited credits (active subscription)
 * DEPRECATED: Planos ilimitados foram removidos. Usar apenas sistema de créditos.
 */
export async function hasUnlimitedCredits(userId: number): Promise<boolean> {
  return false;
}

/**
 * Get user's current credit balance
 */
export async function getCreditBalance(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  return user[0].credits;
}

/**
 * Consume credits for a transformation or purchase
 * Returns true if successful, throws error if insufficient credits
 */
export async function consumeCredit(userId: number, themeName: string, amount: number = 1): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

  // Planos ilimitados foram removidos - sempre consumir créditos

  // Get current balance
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  const currentCredits = user[0].credits;

  // Check if user has enough credits
  if (currentCredits < amount) {
    throw new TRPCError({ 
      code: "FORBIDDEN", 
      message: "Insufficient credits. Please purchase more credits to continue." 
    });
  }

  // Deduct credits
  const newBalance = currentCredits - amount;
  await db.update(users)
    .set({ credits: newBalance })
    .where(eq(users.id, userId));

  // Log transaction
  await db.insert(creditTransactions).values({
    userId,
    type: "consumption",
    amount: -amount,
    balanceAfter: newBalance,
    description: themeName,
  });

  return true;
}

/**
 * Add credits to user account (for purchases)
 */
export async function addCredits(
  userId: number, 
  amount: number, 
  packageType: "credits_50" | "credits_200" | "credits_500" | "credits_1000",
  description?: string
): Promise<number> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  const currentCredits = user[0].credits;

  // Handle credit packages (unlimited plans removed)
  const newBalance = currentCredits + amount;
  await db.update(users)
    .set({ 
      credits: newBalance,
    })
    .where(eq(users.id, userId));

  // Log transaction
    await db.insert(creditTransactions).values({
      userId,
      type: "purchase",
      amount,
      balanceAfter: newBalance,
      description: description || `Purchased ${packageType} package (${amount} credits)`,
      relatedPackage: packageType as any,
    });

  return newBalance;
}

/**
 * DEPRECATED: Support for unlimited plans has been removed.
 * All users now use credit-based system only.
 */

/**
 * Get user's subscription info
 */
export async function getSubscriptionInfo(userId: number) {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  const userData = user[0];
  const isUnlimited = await hasUnlimitedCredits(userId);

  return {
    credits: userData.credits,
    subscriptionType: userData.subscriptionType,
    subscriptionExpiresAt: userData.subscriptionExpiresAt,
    hasUnlimitedCredits: isUnlimited,
  };
}
