import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET_KEY as string,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (error! instanceof Error) {
      console.log(error);
    }
    console.log(`Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }
  console.log("Success:", event.id);

  const permittedEvents: string[] = ["checkout.session.completed", "checkout.session.async_payment_succeeded", "checkout.session.async_payment_failed",];

  const payload = await getPayload({ config });

  if (permittedEvents.includes(event.type)) {
    let data;
    try {
      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded": {
          data = event.data.object as Stripe.Checkout.Session;

          if (!data.metadata?.userId) throw new Error("User ID is required");

          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });
          if (!user) throw new Error("User not found");

          const session = await stripe.checkout.sessions.retrieve(data.id);
          if (session.payment_status !== "paid") {
            break;
          }

          for await (const item of stripe.checkout.sessions.listLineItems(data.id, {
            expand: ["data.price.product"],
          })) {
            const product = item.price?.product as Stripe.Product | undefined;
            if (!product?.metadata?.id) {
              console.log(`Skipping line item without product metadata.id: ${item.id}`);
              continue;
            }

            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                user: user.id,
                product: product.metadata.id,
                name: product.name,
              },
            });
          }
          break;
        }

        case "checkout.session.async_payment_failed": {
          data = event.data.object as Stripe.Checkout.Session;
          console.log(`Async payment failed for session: ${data.id}`);
          break;
        }

        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: "Recieved" }, { status: 200 });
}
