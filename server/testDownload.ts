/**
 * Test helper para simular downloads de alta resolução em ambiente de desenvolvimento
 * Use este arquivo para testar o fluxo completo sem Stripe
 */

import { getDb } from "./db";
import { premiumDownloads } from "../drizzle/schema";

export async function simulateHighResolutionDownload(
  userId: number,
  imageUrl: string,
  resolution: "hd" | "4k",
  product: "camiseta" | "caneca" | "poster",
  theme: string
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Record the download
  await db.insert(premiumDownloads).values({
    userId,
    imageUrl,
    resolution,
    product,
    theme,
    creditsCost: resolution === "hd" ? 10 : 25,
  });

  return {
    success: true,
    message: `Download simulado: ${resolution.toUpperCase()} - ${product}`,
    timestamp: new Date(),
  };
}

/**
 * Get download history for a user
 */
export async function getUserDownloadHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { eq } = await import("drizzle-orm");
  return db
    .select()
    .from(premiumDownloads)
    .where(eq(premiumDownloads.userId, userId))
    .orderBy((t) => t.createdAt);
}
