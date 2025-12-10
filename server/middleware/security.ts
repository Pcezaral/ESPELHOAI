import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

/**
 * Security Middleware for ESPELHO AI
 * Protects against abuse, bots, and unauthorized access
 */

// ============================================================================
// 1. RATE LIMITING
// ============================================================================

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Muitas requisições deste IP, tente novamente mais tarde.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request) => {
    // Don't rate limit admin users
    return (req as any).user?.role === "admin";
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Muitas tentativas de login, tente novamente mais tarde.",
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Transformation rate limiter
 * 50 transformations per hour per user
 */
export const transformationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: "Limite de transformações atingido, tente novamente em 1 hora.",
  keyGenerator: (req: Request) => (req as any).user?.id?.toString() || (req as any).ip, // Rate limit by user ID
});

// ============================================================================
// 2. CORS PROTECTION
// ============================================================================

/**
 * CORS configuration for ESPELHO AI
 * Only allow requests from official domains
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      "https://espelhoai.com.br",
      "https://www.espelhoai.com.br",
      "http://localhost:3000", // Development
      "http://localhost:5173", // Vite dev server
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ============================================================================
// 3. BOT DETECTION
// ============================================================================

/**
 * Detect and block suspicious user agents (bots, scrapers)
 */
export const botDetectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = (req.headers["user-agent"] || "").toLowerCase();

  const suspiciousBots = [
    "curl",
    "wget",
    "scrapy",
    "selenium",
    "phantomjs",
    "headlesschrome",
    "bot",
    "crawler",
    "spider",
    "scraper",
    "python",
    "java",
    "node",
  ];

  const isSuspicious = suspiciousBots.some((bot) => userAgent.includes(bot));

  if (isSuspicious) {
    console.warn(`[SECURITY] Suspicious bot detected: ${userAgent} from ${req.ip}`);
    return res.status(403).json({ error: "Access denied" });
  }

  next();
};

// ============================================================================
// 4. ORIGIN VALIDATION
// ============================================================================

/**
 * Validate request origin and referer
 */
export const originValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Allow requests without origin (e.g., mobile apps, direct API calls)
  if (!origin && !referer) {
    return next();
  }

  const allowedDomains = ["espelhoai.com.br", "localhost"];
  const isValidOrigin = !origin || allowedDomains.some((domain) => origin.includes(domain));
  const isValidReferer = !referer || allowedDomains.some((domain) => referer.includes(domain));

  if (!isValidOrigin && !isValidReferer) {
    console.warn(`[SECURITY] Invalid origin/referer: ${origin || referer} from ${req.ip}`);
    return res.status(403).json({ error: "Invalid origin" });
  }

  next();
};

// ============================================================================
// 5. REQUEST LOGGING
// ============================================================================

/**
 * Log all requests for security monitoring
 */
export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  const userId = (req as any).user?.id || "anonymous";

  // Log suspicious patterns
  if (
    path.includes("admin") ||
    path.includes("api") ||
    method === "DELETE" ||
    method === "PUT"
  ) {
    console.log(`[${timestamp}] ${method} ${path} - User: ${userId} - IP: ${ip}`);
  }

  next();
};

// ============================================================================
// 6. SECURITY HEADERS
// ============================================================================

/**
 * Add security headers to all responses
 */
export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Copyright notice
  res.setHeader("X-Copyright", "Copyright © 2025 ESPELHO AI. All rights reserved.");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  next();
};

// ============================================================================
// 7. ABUSE DETECTION
// ============================================================================

interface AbuseIndicators {
  transformationsPerHour: number;
  uniqueStylesUsed: number;
  downloadRatio: number;
  ipChanges: number;
  suspiciousKeywords: number;
}

/**
 * Detect potential abuse patterns
 */
export function calculateAbuseScore(indicators: AbuseIndicators): {
  score: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
} {
  let score = 0;

  // High transformation rate
  if (indicators.transformationsPerHour > 20) score += 30;
  if (indicators.transformationsPerHour > 50) score += 40;

  // Low style diversity (likely bot)
  if (indicators.uniqueStylesUsed < 2) score += 25;

  // High download ratio (likely commercial use)
  if (indicators.downloadRatio > 0.8) score += 20;

  // Multiple IP changes (suspicious)
  if (indicators.ipChanges > 5) score += 20;

  // Suspicious keywords in profile
  if (indicators.suspiciousKeywords > 0) score += indicators.suspiciousKeywords * 15;

  const risk = score > 60 ? "HIGH" : score > 40 ? "MEDIUM" : "LOW";

  return { score, risk };
}

// ============================================================================
// 8. API KEY VALIDATION
// ============================================================================

/**
 * Validate API key for server-to-server requests
 */
export const apiKeyValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next();
};

// ============================================================================
// 9. EXPORT ALL MIDDLEWARE
// ============================================================================

export const securityMiddleware = {
  apiLimiter,
  authLimiter,
  transformationLimiter,
  botDetectionMiddleware,
  originValidationMiddleware,
  requestLoggingMiddleware,
  securityHeadersMiddleware,
  apiKeyValidationMiddleware,
  calculateAbuseScore,
};
