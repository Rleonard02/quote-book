import express from "express";
import Stripe from "stripe";
import fetch from "node-fetch";
import { getLuluToken } from "../services/lulu";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

// Stripe webhook
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve full session to get payment info
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["payment_intent.payment_method"],
        });

        const shipping = (fullSession.payment_intent as any)?.payment_method?.shipping_details;
        const billing = (fullSession.payment_intent as any)?.payment_method?.billing_details;
        const email = fullSession.customer_details?.email;

        if (!shipping || !email) {
          console.error("Missing shipping or email info; cannot create Lulu order");
          return res.status(400).json({ error: "Missing shipping/email info" });
        }

        console.log("Shipping:", shipping);
        console.log("Billing:", billing);
        console.log("Email:", email);

        // lulu api
        try {
          const token = await getLuluToken();

          const luluResponse = await fetch("https://api.sandbox.lulu.com/print-jobs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              contact_email: email,
              shipping_address: {
                name: shipping.name,
                street1: shipping.address.line1,
                street2: shipping.address.line2 || "",
                city: shipping.address.city,
                state: shipping.address.state,
                postal_code: shipping.address.postal_code,
                country_code: shipping.address.country,
              },
              items: [
                {
                  external_id: `stripe-${session.id}`,
                  quantity: 1,
                  printable_normalization: {
                    cover: { source_url: process.env.LULU_BOOK_COVER_URL },
                    interior: { source_url: process.env.LULU_BOOK_INTERIOR_URL },
                  },
                },
              ],
            }),
          });

          const orderData = await luluResponse.json();

          if (!luluResponse.ok) {
            console.error("Lulu API error:", orderData);
          } else {
            console.log("✅ Lulu order created:", orderData);
          }
        } catch (err: any) {
          console.error("Error sending order to Lulu:", err.message);
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;
