import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
});

// Preços dos pacotes em centavos (BRL)
export const PACKAGE_PRICES = {
  light: 990, // R$ 9,90
  premium: 1990, // R$ 19,90
  monthly_unlimited: 2990, // R$ 29,90
  annual_unlimited: 11990, // R$ 119,90
} as const;

export const PACKAGE_CREDITS = {
  light: 50,
  premium: 200,
  monthly_unlimited: 0, // Ilimitado
  annual_unlimited: 0, // Ilimitado
} as const;

export const PACKAGE_NAMES = {
  light: "Pacote Light - 50 Créditos",
  premium: "Pacote Premium - 200 Créditos",
  monthly_unlimited: "Ilimitado Mensal",
  annual_unlimited: "Ilimitado Anual",
} as const;

export type PackageType = keyof typeof PACKAGE_PRICES;

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
            description: packageType.includes("unlimited")
              ? "Créditos ilimitados para transformações"
              : `${PACKAGE_CREDITS[packageType]} créditos para transformações`,
          },
          unit_amount: PACKAGE_PRICES[packageType],
        },
        quantity: 1,
      },
    ],
    mode: packageType.includes("unlimited") ? "subscription" : "payment",
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
