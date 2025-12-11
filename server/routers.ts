import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { ratings } from "../drizzle/schema";
import { consumeCredit, getCreditBalance, addCredits, getSubscriptionInfo } from "./credits";
import { createCheckoutSession, verifyPayment, type PackageType } from "./stripe";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  generation: router({
    uploadImage: protectedProcedure
      .input(z.object({
        imageBase64: z.string(),
        filename: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { uploadImageToS3 } = await import("./generation");
        return uploadImageToS3(input.imageBase64, input.filename, ctx.user.id);
      }),
    generate: protectedProcedure
      .input(z.object({
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon"]),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Consume credit before generating
        const themeNames = {
          animals: "Bichinho",
          monster: "Monstro",
          art: "Pintura",
          gender: "Se tivesse nascido...",
          epic: "Romanos, Gregos e Vikings",
          gangster: "Gangster 1920s",
          circus: "Circo",
          natal: "Natal",
          reveillon: "Réveillon"
        };
        await consumeCredit(ctx.user.id, themeNames[input.theme]);
        
        const { generateTransformation } = await import("./generation");
        return generateTransformation(input.theme, input.imageUrl, ctx.user.id);
      }),
    
    downloadHighResolution: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
        resolution: z.enum(["hd", "4k"]),
        product: z.enum(["camiseta", "caneca", "poster"]),
        theme: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const creditCost = input.resolution === "hd" ? 5 : 10;
        const resolutionName = input.resolution === "hd" ? "HD (300 DPI)" : "Premium 4K (600 DPI)";
        
        // Consume credits
        await consumeCredit(ctx.user.id, `Download ${resolutionName} - ${input.product}`, creditCost);
        
        // Record download in database
        const db = await getDb();
        if (db) {
          const { premiumDownloads } = await import("../drizzle/schema");
          await db.insert(premiumDownloads).values({
            userId: ctx.user.id,
            imageUrl: input.imageUrl,
            resolution: input.resolution,
            product: input.product,
            theme: input.theme,
            creditsCost: creditCost,
          });
        }
        
        return { success: true, creditsCost: creditCost };
      }),

    testDownload: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
        resolution: z.enum(["hd", "4k"]),
        product: z.enum(["camiseta", "caneca", "poster"]),
        theme: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const creditCost = input.resolution === "hd" ? 5 : 10;
        const resolutionName = input.resolution === "hd" ? "HD (300 DPI)" : "Premium 4K (600 DPI)";
        
        await consumeCredit(ctx.user.id, `[TESTE] Download ${resolutionName} - ${input.product}`, creditCost);
        
        const db = await getDb();
        if (db) {
          const { premiumDownloads } = await import("../drizzle/schema");
          await db.insert(premiumDownloads).values({
            userId: ctx.user.id,
            imageUrl: input.imageUrl,
            resolution: input.resolution,
            product: input.product,
            theme: input.theme,
            creditsCost: creditCost,
          });
        }
        
        return { 
          success: true, 
          creditsCost: creditCost,
          message: "[MODO TESTE] Download simulado com sucesso!",
        };
      }),

  }),

  credits: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      return getCreditBalance(ctx.user.id);
    }),
    testAddCredits: protectedProcedure
      .input(z.object({
        amount: z.number().min(1).max(10000),
      }))
      .mutation(async ({ ctx, input }) => {
        return addCredits(ctx.user.id, input.amount, "credits_50", "Test credits");
      }),
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      return getSubscriptionInfo(ctx.user.id);
    }),
    getTransactionHistory: protectedProcedure.query(async ({ ctx }) => {
      const { getTransactionHistory } = await import("./db");
      return getTransactionHistory(50);
    }) as any,
  }),

  stripe: router({
    createCheckout: protectedProcedure
      .input(z.object({
        packageType: z.enum(["credits_50", "credits_200", "credits_500", "credits_1000"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const baseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "http://localhost:3000";
        const successUrl = `${baseUrl}/planos?success=true&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${baseUrl}/planos?canceled=true`;

        const session = await createCheckoutSession(
          input.packageType as PackageType,
          ctx.user.id,
          ctx.user.email,
          successUrl,
          cancelUrl
        );

        return session;
      }),
    verifyPayment: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await verifyPayment(input.sessionId);
        
        if (result.success && result.packageType && result.userId === ctx.user.id) {
          const { PACKAGE_CREDITS } = await import("./stripe");
          const credits = PACKAGE_CREDITS[result.packageType] || 0;
          
          const newBalance = await addCredits(
            ctx.user.id,
            credits,
            result.packageType
          );
          
          return { success: true, newBalance };
        }
        
        return { success: false };
      }),
  }),

  rating: router({
    submit: protectedProcedure
      .input(z.object({
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon"]),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        }
        
        await db.insert(ratings).values({
          userId: ctx.user.id,
          theme: input.theme,
          rating: input.rating,
          comment: input.comment,
        });
        
        return { success: true };
      }),
  }),

  gallery: router({
    trending: publicProcedure
      .query(async () => {
        const { getTrendingTransformations } = await import("./db");
        return getTrendingTransformations(6);
      }),
  }),

  referral: router({
    getReferralStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const { referrals } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const myReferrals = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referrerId, ctx.user.id));

      const completedReferrals = myReferrals.filter((r) => r.status === "completed");
      const totalCreditsEarned = completedReferrals.reduce((sum, r) => sum + r.creditsAwarded, 0);

      return {
        totalReferrals: myReferrals.length,
        completedReferrals: completedReferrals.length,
        totalCreditsEarned,
        referrals: myReferrals,
      };
    }),

    processReferral: publicProcedure
      .input(z.object({
        referrerId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
        }

        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        }

        const { referrals } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");

        const existingReferral = await db
          .select()
          .from(referrals)
          .where(eq(referrals.referredId, ctx.user.id))
          .limit(1);

        if (existingReferral.length > 0) {
          throw new TRPCError({ code: "CONFLICT", message: "You already have a referrer" });
        }

        await db.insert(referrals).values({
          referrerId: input.referrerId,
          referredId: ctx.user.id,
          creditsAwarded: 5,
          status: "completed",
          completedAt: new Date(),
        });

        await addCredits(input.referrerId, 5, "credits_50", "Referral bonus");
        await addCredits(ctx.user.id, 5, "credits_50", "Referral bonus");

        return { success: true };
      }),
  }),

  support: router({
    createTicket: protectedProcedure
      .input(z.object({
        subject: z.string(),
        message: z.string(),
        category: z.enum(["generation", "connection", "credits", "payment", "other"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        }
        
        const { supportTickets } = await import("../drizzle/schema");
        
        await db.insert(supportTickets).values({
          userId: ctx.user.id,
          subject: input.subject,
          message: input.message,
          status: "open",
          priority: input.category === "generation" ? "high" : "medium",
        });
        
        return { success: true };
      }),
    getTickets: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      
      const { supportTickets } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      return db.select().from(supportTickets).where(eq(supportTickets.userId, ctx.user.id));
    }),
  }),

  // Promo codes / Cupons
  promo: router({
    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const { validatePromoCode } = await import("./db");
        const promo = await validatePromoCode(input.code);
        return promo ? { valid: true, discount: promo } : { valid: false };
      }),
    useCode: protectedProcedure
      .input(z.object({ code: z.string(), purchaseAmount: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const { validatePromoCode, usePromoCode } = await import("./db");
        const promo = await validatePromoCode(input.code);
        if (!promo) throw new TRPCError({ code: 'NOT_FOUND', message: 'Código inválido' });
        
        const discount = await usePromoCode(ctx.user.id, promo.id, input.purchaseAmount);
        return { success: true, discountAmount: discount };
      }),
  }),

  // Affiliate Program
  affiliate: router({
    create: protectedProcedure.mutation(async ({ ctx }) => {
      const { createAffiliate } = await import("./db");
      const affiliateCode = await createAffiliate(ctx.user.id);
      return { success: true, affiliateCode };
    }),
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;
      
      const { affiliates } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      const affiliate = await db.select().from(affiliates).where(eq(affiliates.userId, ctx.user.id)).limit(1);
      if (affiliate.length === 0) return null;
      
      const { getAffiliateStats } = await import("./db");
      return getAffiliateStats(affiliate[0].id);
    }),
  }),

  // Social Shares
  social: router({
    recordShare: protectedProcedure
      .input(z.object({ transformationId: z.number(), platform: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const { recordSocialShare } = await import("./db");
        await recordSocialShare(ctx.user.id, input.transformationId, input.platform);
        return { success: true };
      }),
    getStats: publicProcedure
      .input(z.object({ transformationId: z.number() }))
      .query(async ({ input }) => {
        const { getSocialShareStats } = await import("./db");
        return getSocialShareStats(input.transformationId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
