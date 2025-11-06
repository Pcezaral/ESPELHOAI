import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users, creditTransactions } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

/**
 * Check if user has unlimited credits (active subscription)
 */
export async function hasUnlimitedCredits(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) return false;

  const userData = user[0];
  
  // Check if user has unlimited subscription
  if (userData.subscriptionType === "monthly_unlimited" || userData.subscriptionType === "annual_unlimited") {
    // Check if subscription is still valid
    if (userData.subscriptionExpiresAt && userData.subscriptionExpiresAt > new Date()) {
      return true;
    }
    // Subscription expired, reset to free
    await db.update(users)
      .set({ subscriptionType: "free", subscriptionExpiresAt: null })
      .where(eq(users.id, userId));
    return false;
  }

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
 * Consume one credit for a transformation
 * Returns true if successful, throws error if insufficient credits
 */
export async function consumeCredit(userId: number, themeName: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

  // Check if user has unlimited credits
  if (await hasUnlimitedCredits(userId)) {
    // Log the consumption but don't deduct credits
    await db.insert(creditTransactions).values({
      userId,
      type: "consumption",
      amount: 0, // No credits consumed for unlimited users
      balanceAfter: -1, // -1 indicates unlimited
      description: `Generated ${themeName} transformation (unlimited plan)`,
    });
    return true;
  }

  // Get current balance
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  const currentCredits = user[0].credits;

  // Check if user has enough credits
  if (currentCredits < 1) {
    throw new TRPCError({ 
      code: "FORBIDDEN", 
      message: "Insufficient credits. Please purchase more credits to continue." 
    });
  }

  // Deduct credit
  const newBalance = currentCredits - 1;
  await db.update(users)
    .set({ credits: newBalance })
    .where(eq(users.id, userId));

  // Log transaction
  await db.insert(creditTransactions).values({
    userId,
    type: "consumption",
    amount: -1,
    balanceAfter: newBalance,
    description: `Generated ${themeName} transformation`,
  });

  return true;
}

/**
 * Add credits to user account (for purchases)
 */
export async function addCredits(
  userId: number, 
  amount: number, 
  packageType: "light" | "premium" | "monthly_unlimited" | "annual_unlimited",
  description?: string
): Promise<number> {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  const currentCredits = user[0].credits;

  // Handle unlimited subscriptions
  if (packageType === "monthly_unlimited" || packageType === "annual_unlimited") {
    const expirationDate = new Date();
    if (packageType === "monthly_unlimited") {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    await db.update(users)
      .set({ 
        subscriptionType: packageType,
        subscriptionExpiresAt: expirationDate
      })
      .where(eq(users.id, userId));

    // Log transaction
    await db.insert(creditTransactions).values({
      userId,
      type: "purchase",
      amount: 0, // Unlimited doesn't add specific credits
      balanceAfter: -1, // -1 indicates unlimited
      description: description || `Purchased ${packageType} subscription`,
      relatedPackage: packageType,
    });

    return -1; // Return -1 to indicate unlimited
  }

  // Handle credit packages (light, premium)
  const newBalance = currentCredits + amount;
  await db.update(users)
    .set({ 
      credits: newBalance,
      subscriptionType: packageType
    })
    .where(eq(users.id, userId));

  // Log transaction
  await db.insert(creditTransactions).values({
    userId,
    type: "purchase",
    amount,
    balanceAfter: newBalance,
    description: description || `Purchased ${packageType} package (${amount} credits)`,
    relatedPackage: packageType,
  });

  return newBalance;
}

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
