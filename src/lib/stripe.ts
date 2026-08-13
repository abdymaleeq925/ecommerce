import Stripe from "stripe"

let stripeClient: Stripe | null = null;

export const getStripeClient = (): Stripe => {
  if (stripeClient) return stripeClient;

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  stripeClient = new Stripe(apiKey, {
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
  });

  return stripeClient;
};