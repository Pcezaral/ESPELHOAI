import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function renderErrorPage(title: string, message: string, errorDetails?: string): string {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: #f5f5f5; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            margin: 0; 
          }
          .container { 
            background: white; 
            padding: 2rem; 
            border-radius: 8px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
            max-width: 500px; 
            text-align: center; 
          }
          h1 { 
            color: #d32f2f; 
            margin-top: 0; 
          }
          p { 
            color: #666; 
            line-height: 1.6; 
          }
          .error-details { 
            background: #f5f5f5; 
            padding: 1rem; 
            border-radius: 4px; 
            font-family: monospace; 
            margin: 1rem 0; 
            color: #333; 
            font-size: 0.85rem; 
            word-break: break-word; 
            text-align: left;
          }
          button { 
            background: #f97316; 
            color: white; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 4px; 
            cursor: pointer; 
            font-size: 1rem; 
          }
          button:hover { 
            background: #ea580c; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>❌ ${title}</h1>
          <p>${message}</p>
          ${errorDetails ? `<div class="error-details">${errorDetails}</div>` : ''}
          <p style="font-size: 0.9rem; color: #999;">Tente novamente ou entre em contato com o suporte.</p>
          <button onclick="window.location.href='/'">Voltar para Início</button>
        </div>
      </body>
    </html>
  `;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const error = getQueryParam(req, "error");
    const errorDescription = getQueryParam(req, "error_description");

    // Handle OAuth error from provider
    if (error) {
      console.error("[OAuth] Provider error:", error, errorDescription);
      res.status(400).send(
        renderErrorPage(
          "Erro de Autenticação",
          "O provedor de autenticação retornou um erro.",
          `${error}${errorDescription ? ': ' + errorDescription : ''}`
        )
      );
      return;
    }

    if (!code || !state) {
      console.error("[OAuth] Missing code or state");
      res.status(400).send(
        renderErrorPage(
          "Erro de Autenticação",
          "Parâmetros inválidos no callback. Tente novamente."
        )
      );
      return;
    }

    try {
      console.log("[OAuth] Exchanging code for token...");
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      console.log("[OAuth] Got token response, fetching user info...");
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      console.log("[OAuth] Got user info:", { openId: userInfo.openId, email: userInfo.email });

      if (!userInfo.openId) {
        console.error("[OAuth] openId missing from user info");
        res.status(400).send(
          renderErrorPage(
            "Erro de Autenticação",
            "Não conseguimos recuperar suas informações de perfil. Tente novamente."
          )
        );
        return;
      }

      if (!userInfo.email) {
        console.error("[OAuth] Email missing from user info");
        throw new Error("User email is required");
      }
      
      console.log("[OAuth] Upserting user...");
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      console.log("[OAuth] Creating session token...");
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      console.log("[OAuth] Success! Redirecting to /");
      res.redirect(302, "/");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[OAuth] Callback failed:", errorMessage, error);
      res.status(500).send(
        renderErrorPage(
          "Erro de Autenticação",
          "Desculpe, houve um problema ao processar sua autenticação.",
          errorMessage
        )
      );
    }
  });
}
