import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
});

/**
 * Sistema de Desconto Progressivo
 * Quanto mais créditos, maior o desconto
 */
export const CREDIT_PACKAGES = [
  { credits: 50, priceInCents: 5000, discount: 0 }, // R$ 50.00 (0%)
  { credits: 200, priceInCents: 18000, discount: 10 }, // R$ 180.00 (10%)
  { credits: 500, priceInCents: 40000, discount: 20 }, // R$ 400.00 (20%)
  { credits: 1000, priceInCents: 70000, discount: 30 }, // R$ 700.00 (30%)
] as const;

export const PACKAGE_PRICES = {
  credits_50: 5000,
  credits_200: 18000,
  credits_500: 40000,
  credits_1000: 70000,
} as const;

export const PACKAGE_CREDITS = {
  credits_50: 50,
  credits_200: 200,
  credits_500: 500,
  credits_1000: 1000,
} as const;

export const PACKAGE_NAMES = {
  credits_50: "50 Créditos",
  credits_200: "200 Créditos (10% OFF)",
  credits_500: "500 Créditos (20% OFF)",
  credits_1000: "1000 Créditos (30% OFF)",
} as const;

export type PackageType = keyof typeof PACKAGE_PRICES;

/**
 * Calcula o preço por crédito
 */
export function getPricePerCredit(packageType: PackageType): number {
  const price = PACKAGE_PRICES[packageType];
  const credits = PACKAGE_CREDITS[packageType];
  return price / credits; // em centavos
}

/**
 * Cria uma sessão de checkout do Stripe
 */
export async function createCheckoutSession(
  packageType: PackageType,
  userId: number,
  userEmail: string | null,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: PACKAGE_NAMES[packageType],
            description: `${PACKAGE_CREDITS[packageType]} créditos para transformações`,
          },
          unit_amount: PACKAGE_PRICES[packageType],
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId.toString(),
    customer_email: userEmail || undefined,
    metadata: {
      userId: userId.toString(),
      packageType,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Verifica se um pagamento foi concluído com sucesso
 */
export async function verifyPayment(sessionId: string): Promise<{
  success: boolean;
  packageType?: PackageType;
  userId?: number;
}> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return {
        success: true,
        packageType: session.metadata?.packageType as PackageType,
        userId: session.metadata?.userId ? parseInt(session.metadata.userId) : undefined,
      };
    }

    return { success: false };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return { success: false };
  }
}

/**
 * Constrói a assinatura do webhook do Stripe
 */
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}


/**
 * Preços para downloads premium
 */
export const DOWNLOAD_PRICES = {
  hd: 1500, // R$ 15.00 para HD
  "4k": 2500, // R$ 25.00 para 4K
} as const;

export const DOWNLOAD_NAMES = {
  hd: "Download HD (300 DPI)",
  "4k": "Download 4K (600 DPI)",
} as const;

/**
 * Cria uma sessão de checkout para download premium
 */
export async function createDownloadCheckoutSession(
  resolution: "hd" | "4k",
  userId: number,
  userEmail: string | null,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const price = DOWNLOAD_PRICES[resolution];
  const name = DOWNLOAD_NAMES[resolution];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: name,
            description: `Download de imagem em alta resolução ${resolution === "hd" ? "300 DPI" : "600 DPI"}`,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId.toString(),
    customer_email: userEmail || undefined,
    metadata: {
      userId: userId.toString(),
      downloadType: "premium",
      resolution,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create download checkout session URL");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}
