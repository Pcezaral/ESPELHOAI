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
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon", "beach"]),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const themeNames = {
          animals: "Bichinho",
          monster: "Monstro",
          art: "Pintura",
          gender: "Se tivesse nascido...",
          epic: "Romanos, Gregos e Vikings",
          gangster: "Gangster 1920s",
          circus: "Circo",
          natal: "Natal",
          reveillon: "Réveillon",
          beach: "Praia 2026"
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
        theme: z.enum(["animals", "monster", "art", "gender", "epic", "gangster", "circus", "natal", "reveillon", "beach"]),
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
});

export type AppRouter = typeof appRouter;
