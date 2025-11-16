import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const origin =
      req.headers.origin || "https://www.henryquotes.com";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1STujrEqBNAQKIlkIyxticox",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
