import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

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
        theme: z.enum(["monster", "animals", "hero", "art", "movies"]),
        imageUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { generateTransformation } = await import("./generation");
        return generateTransformation(input.theme, input.imageUrl, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
