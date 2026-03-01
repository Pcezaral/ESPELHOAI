import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { ratings } from "../drizzle/schema";
import { consumeCredit, getCreditBalance, addCredits, getSubscriptionInfo } from "./credits";
import { 
  saveTransformationToHistory, 
  getUserTransformationHistory, 
  getTransformationById, 
  cleanupExpiredTransformations,
  toggleTransformationFavorite,
  getUserFavoriteTransformations,
  getUserTransformationsByTheme,
  getExpiringTransformations,
  markTransformationsAsNotified,
  getTransformationCounts
} from "./db";
import { createCheckoutSession, verifyPayment, type PackageType } from "./stripe";
import { THEME_NAMES, type ThemeId } from "@shared/themes";

export const appRouter = router({
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
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "pet"]),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Consumir crédito ANTES da geração
        await consumeCredit(ctx.user.id, THEME_NAMES[input.theme as ThemeId]);
        
        try {
          const { generateTransformation } = await import("./generation");
          return await generateTransformation(input.theme, input.imageUrl, ctx.user.id);
        } catch (error: any) {
          // REEMBOLSO AUTOMÁTICO se a geração falhar
          console.error(`[Generation] Failed for user ${ctx.user.id}, refunding credit:`, error?.message);
          try {
            const { refundCredit } = await import("./credits");
            await refundCredit(ctx.user.id, 1, `Reembolso: falha na geração ${THEME_NAMES[input.theme as ThemeId]}`);
            console.log(`[Generation] Credit refunded for user ${ctx.user.id}`);
          } catch (refundError) {
            console.error(`[Generation] CRITICAL: Failed to refund credit for user ${ctx.user.id}:`, refundError);
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Falha na geração da imagem. Seu crédito foi reembolsado automaticamente. Tente novamente."
          });
        }
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
        
        await consumeCredit(ctx.user.id, `Download ${resolutionName} - ${input.product}`, creditCost);
        
        const { generateHighResolutionImage } = await import("./generation");
        let downloadUrl: string;
        try {
          const result = await generateHighResolutionImage(
            input.imageUrl,
            input.resolution,
            ctx.user.id
          );
          downloadUrl = result.url;
          console.log("[Download] Generated URL:", downloadUrl);
        } catch (error) {
          console.error("[Download] Generation failed:", error);
          throw new Error("Falha ao gerar imagem em alta resolucao");
        }
        
        const db = await getDb();
        if (db) {
          const { premiumDownloads } = await import("../drizzle/schema");
          await db.insert(premiumDownloads).values({
            userId: ctx.user.id,
            imageUrl: downloadUrl,
            resolution: input.resolution,
            product: input.product,
            theme: input.theme,
            creditsCost: creditCost,
          });
        }
        
        return { 
          success: true, 
          creditsCost: creditCost, 
          downloadUrl: downloadUrl,
          message: `Imagem ${resolutionName} pronta para download!`
        };
      }),
    generateBeforeAfter: protectedProcedure
      .input(z.object({
        originalImageUrl: z.string(),
        transformedImageUrl: z.string(),
        theme: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        await consumeCredit(ctx.user.id, `Download Antes/Depois - ${input.theme}`, 1);
        
        // Usar sharp para compor imagens (rápido e preciso, sem IA)
        const { composeBeforeAfterImage } = await import("./imageComposer");
        const result = await composeBeforeAfterImage(
          input.originalImageUrl,
          input.transformedImageUrl,
          ctx.user.id
        );
        
        return { 
          success: true, 
          creditsCost: 1, 
          downloadUrl: result.url,
          message: "Imagem Antes/Depois pronta para download!"
        };
      }),
    // Adicionar marca d'água (logo + link) para compartilhamento - GRÁTIS
    addWatermark: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { addWatermarkToImage } = await import("./imageComposer");
        const result = await addWatermarkToImage(
          input.imageUrl,
          ctx.user.id
        );
        
        return { 
          success: true, 
          imageUrl: result.url,
        };
      }),
  }),

  credits: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      return getCreditBalance(ctx.user.id);
    }),
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      return getSubscriptionInfo(ctx.user.id);
    }),
  }),

  stripe: router({
    createCheckout: protectedProcedure
      .input(z.object({
        packageType: z.enum(["light", "premium", "monthly_unlimited", "annual_unlimited"]),
      }))
      .mutation(async ({ input, ctx }) => {
        // Usar o domínio correto para redirecionamento após pagamento
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://www.espelhoai.com.br' 
          : 'http://localhost:3000';
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
          const creditsMap = {
            light: 50,
            premium: 200,
            monthly_unlimited: 0,
            annual_unlimited: 0,
          };
          
          const newBalance = await addCredits(
            ctx.user.id,
            creditsMap[result.packageType],
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
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "pet"]),
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

  // Histórico de transformações (mantém por 5 dias)
  history: router({
    // Salvar transformação no histórico
    save: protectedProcedure
      .input(z.object({
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "pet"]),
        originalImageUrl: z.string(),
        transformedImageUrl: z.string(),
        watermarkedImageUrl: z.string().optional(),
        beforeAfterImageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const saved = await saveTransformationToHistory(
          ctx.user.id,
          input.theme,
          input.originalImageUrl,
          input.transformedImageUrl,
          input.watermarkedImageUrl,
          input.beforeAfterImageUrl
        );
        
        if (!saved) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao salvar transformação" });
        }
        
        return { success: true, transformationId: saved.id };
      }),

    // Buscar histórico do usuário
    list: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).optional().default(20),
      }))
      .query(async ({ ctx, input }) => {
        const history = await getUserTransformationHistory(ctx.user.id, input.limit);
        return { transformations: history };
      }),

    // Buscar transformação específica
    get: protectedProcedure
      .input(z.object({
        transformationId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const transformation = await getTransformationById(input.transformationId, ctx.user.id);
        
        if (!transformation) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Transformação não encontrada ou expirada" });
        }
        
        return { transformation };
      }),

    // Limpeza de transformações expiradas (pode ser chamada por admin ou cron)
    cleanup: publicProcedure.mutation(async () => {
      const deletedCount = await cleanupExpiredTransformations();
      return { success: true, deletedCount };
    }),

    // Marcar/desmarcar como favorito
    toggleFavorite: protectedProcedure
      .input(z.object({
        transformationId: z.number(),
        isFavorite: z.boolean(),
      }))
      .mutation(async ({ ctx, input }) => {
        const success = await toggleTransformationFavorite(
          input.transformationId,
          ctx.user.id,
          input.isFavorite
        );
        
        if (!success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Falha ao atualizar favorito" });
        }
        
        return { success: true, isFavorite: input.isFavorite };
      }),

    // Buscar apenas favoritos
    listFavorites: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).optional().default(50),
      }))
      .query(async ({ ctx, input }) => {
        const favorites = await getUserFavoriteTransformations(ctx.user.id, input.limit);
        return { transformations: favorites };
      }),

    // Buscar por tema específico
    listByTheme: protectedProcedure
      .input(z.object({
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "pet"]),
        limit: z.number().min(1).max(50).optional().default(20),
      }))
      .query(async ({ ctx, input }) => {
        const history = await getUserTransformationsByTheme(ctx.user.id, input.theme, input.limit);
        return { transformations: history };
      }),

    // Buscar transformações que vão expirar em breve (para notificação)
    getExpiring: protectedProcedure.query(async ({ ctx }) => {
      const expiring = await getExpiringTransformations(ctx.user.id);
      return { transformations: expiring };
    }),

    // Marcar como notificado sobre expiração
    markNotified: protectedProcedure
      .input(z.object({
        transformationIds: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        const success = await markTransformationsAsNotified(input.transformationIds);
        return { success };
      }),

    // Obter contagens (total, favoritos, expirando)
    getCounts: protectedProcedure.query(async ({ ctx }) => {
      const counts = await getTransformationCounts(ctx.user.id);
      return counts;
    }),
  }),
});

export type AppRouter = typeof appRouter;
