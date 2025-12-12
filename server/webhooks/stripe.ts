import type { Request, Response } from "express";
import { stripe, constructWebhookEvent, type PackageType } from "../stripe";
import { addCredits } from "../credits";

/**
 * Webhook handler para eventos do Stripe
 * Processa pagamentos confirmados e adiciona créditos automaticamente
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature || typeof signature !== "string") {
    console.error("[Stripe Webhook] Missing or invalid signature");
    return res.status(400).send("Missing signature");
  }

  try {
    // Construct event from raw body
    const event = constructWebhookEvent(req.body, signature);

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Extract metadata
        const userId = session.metadata?.userId;
        const packageType = session.metadata?.packageType as PackageType;

        if (!userId || !packageType) {
          console.error("[Stripe Webhook] Missing metadata in session", session.id);
          return res.status(400).send("Missing metadata");
        }

        // Check if payment was successful
        if (session.payment_status === "paid") {
          console.log(`[Stripe Webhook] Payment confirmed for user ${userId}, package ${packageType}`);

          // Add credits based on package type
          const creditsMap = {
            light: 50,
            premium: 200,
            monthly_unlimited: 0,
            annual_unlimited: 0,
          };

          try {
            const newBalance = await addCredits(
              parseInt(userId),
              creditsMap[packageType],
              packageType
            );

            console.log(`[Stripe Webhook] Credits added successfully. New balance: ${newBalance}`);
          } catch (error) {
            console.error("[Stripe Webhook] Error adding credits:", error);
            return res.status(500).send("Error adding credits");
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        // Handle subscription cancellation
        const subscription = event.data.object;
        console.log(`[Stripe Webhook] Subscription deleted: ${subscription.id}`);
        // TODO: Update user's subscription status in database
        break;
      }

      case "invoice.payment_failed": {
        // Handle failed payment
        const invoice = event.data.object;
        console.log(`[Stripe Webhook] Payment failed for invoice: ${invoice.id}`);
        // TODO: Notify user about failed payment
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Return success response
    res.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook] Error processing webhook:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
