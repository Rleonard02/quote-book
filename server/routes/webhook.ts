import express from "express";
import Stripe from "stripe";
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

// middleware — required by Stripe
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

            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["payment_intent.payment_method"],
            });

            console.log('session ', fullSession);

            //const shipping = fullSession.shipping;
            const billing = (fullSession.payment_intent as any).payment_method.billing_details;

            //console.log("✅ Shipping:", shipping);
            console.log("✅ Billing:", billing);

            // 🔥 TODO: Call Lulu API here

        }

        res.json({ received: true });

        } catch (err: any) {
            console.error("webhook error:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
  }
);

export default router;
