import { Inngest } from "inngest";
import { prisma } from "../config/prisma.js";

const LOW_STOCK_THRESHOLD = 10;

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "grocery-delivery",
  schemas: {
    events: {
      "inventory/stock.updated": {
        data: {
          productId: "string",
        },
      },
    },
  },
});

// Low stock alert to admin
const ckeckLowStock = inngest.createFunction(
  { id: "check-low-stock",
    name: "Low Stock Alert",
    triggers: [{ event: "inventory/stock.updated" }] },
  async ({ event, step }) => {
    const productId = event.data.productId;

    const product = await step.run("fetch-product", async () => {
        return await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
    })

    if (!product || product.stock === null || product.stock >= LOW_STOCK_THRESHOLD) {
        return {skipped: true, stock: product?.stock};
    }

    await step.run("send-email", async () => {
        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : [];

        if (adminEmails.length === 0) return {skipped: true, reason: "No admin emails"};
    })
  },
);


// Create an empty array where we'll export future Inngest functions
export const functions = [];