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

        const shipping = fullSession.customer_details?.address;
        const shipping_name = fullSession.customer_details?.name;
        const email = fullSession.customer_details?.email;

        console.log("Stripe full session:", fullSession);
        console.log("Shipping:", shipping);
        console.log("Email:", email);

        if (!shipping || !email) {
          console.error("Missing shipping or email info; cannot create Lulu order");
          return res.status(400).json({ error: "Missing shipping/email info" });
        }

        try {
          const token = await getLuluToken();
          console.log(" token fetched:", token);

          const printJobResponse = await fetch("https://api.lulu.com/v2/print-jobs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              contact_email: email,
              line_items: [
              {
                  pod_package_id: "0550X0850BWSTDPB060UW444GXX",
                  quantity: 1,
                  title: "Me Myself and My Mind",
                  cover: {
                      source_url: "https://dl.dropboxusercontent.com/scl/fi/tatj7p0c696xajz83a18f/Front-Spine-Back-Spread-Halloween-FINAL.pdf?rlkey=s6e9utv7lhn4xq0refct6ahm5&st=bpsh0fhn",
                  },
                  interior: {
                      source_url: "https://dl.dropboxusercontent.com/scl/fi/ck9d863hdphimh91jyqew/MANUSCRIPTHALLOWEEN.pdf?rlkey=rf45fks0ibl6fu4fv7ymj73s7&st=4mejzbnb",
                  },
              },
            ],
              shipping_address: {
                name: shipping_name,
                street1: shipping.line1,
                city: shipping.city,
                state: shipping.state,
                postal_code: shipping.postal_code,
                country_code: shipping.country,
                phone_number: fullSession.customer_details?.phone,
              },
              shipping_level: "MAIL",
            }),
          });

          const responseText = await printJobResponse.text();
          console.log('response text: ', responseText);

          const traceId = printJobResponse.headers.get("x-request-id");
          console.log("Lulu trace ID:", traceId);
          
          // Log full response for debugging
          if (!printJobResponse.ok) {
            console.error(
              `Lulu print job request failed: ${printJobResponse.status}`,
              responseText
            );
          } else {
            try {
              const jobData = JSON.parse(responseText);
              console.log("Lulu sandbox order created:", jobData);
            } catch (err) {
              console.error("Failed to parse Lulu response JSON:", err, responseText);
            }
          }
        } catch (err: any) {
          console.error("Error sending order to Lulu sandbox:", err.message);
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
