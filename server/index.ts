import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkoutRouter from "./routes/checkout";
import webhookRouter from "./routes/webhook";

dotenv.config();
console.log("Loaded Stripe key:", process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", checkoutRouter);

app.use("/webhook", webhookRouter);

app.get("/", (req, res) => {
  res.send("Backend running!");
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
