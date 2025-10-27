import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkoutRouter from "./routes/checkout";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount checkout routes
app.use("/", checkoutRouter);

app.get("/", (req, res) => {
  res.send("Backend running!");
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
