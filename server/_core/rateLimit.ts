import rateLimit from "express-rate-limit";

/**
 * Rate limiter para geração de imagens
 * Máximo 5 gerações a cada 15 minutos por IP
 */
export const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 requisições por janela
  message: {
    error: "Limite de gerações atingido. Máximo de 5 transformações a cada 15 minutos.",
    retryAfter: "15 minutos"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Usa IP padrão como chave (express-rate-limit gerencia IPv6 automaticamente)
});

/**
 * Rate limiter geral para API
 * Máximo 100 requisições por minuto por IP
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // Máximo 100 requisições por minuto
  message: {
    error: "Muitas requisições. Tente novamente em alguns segundos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para checkout/pagamentos
 * Máximo 10 tentativas por 10 minutos por IP
 */
export const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10,
  message: {
    error: "Muitas tentativas de checkout. Tente novamente em alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
