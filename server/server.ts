import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/products.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import orderRouter from "./routes/order.route.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import addressRouter from "./routes/address.route.js";
import adminRouter from "./routes/admin.route.js";
import deliveryPartnersRouter from "./routes/deliveryPartners.route.js";
import { stripeWebhook } from "./controllers/webhooks.controller.js";

const app = express();

app.post("/api/stripe", express.raw({type: 'application/json'}), stripeWebhook);

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/orders", orderRouter);
app.get("/api/debug-inngest", (req: Request, res: Response) => {
  res.json({
    signingKeyExists: !!process.env.INNGEST_SIGNING_KEY,
    eventKeyExists: !!process.env.INNGEST_EVENT_KEY,
    nodeEnv: process.env.NODE_ENV,
  });
});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/address", addressRouter);
app.use("/api/admin", adminRouter);
app.use("/api/delivery", deliveryPartnersRouter);

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: error.message });
});

export default app;
