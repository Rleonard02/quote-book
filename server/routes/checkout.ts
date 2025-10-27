import express, { Request, Response } from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

router.post("/api/create-checkout-session", async (req: Request, res: Response) => {
  console.log('backend');
  try {
    const origin = req.get("origin") || "http://localhost:5173";

    console.log('help');

    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "usd",
    //         product_data: { name: "Book" },
    //         unit_amount: 1999, // $19.99
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: `${origin}/success`,
    //   cancel_url: `${origin}/cancel`,
    // });

    // res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
