import { cron, Inngest } from "inngest";
import { prisma } from "../config/prisma.js";
import sendEmail from "../config/nodemailer.js";

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
  {
    id: "check-low-stock",
    name: "Low Stock Alert",
    triggers: [{ event: "inventory/stock.updated" }],
  },
  async ({ event, step }) => {
    const productId = event.data.productId;

    const product = await step.run("fetch-product", async () => {
      return await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
    });

    if (
      !product ||
      product.stock === null ||
      product.stock >= LOW_STOCK_THRESHOLD
    ) {
      return { skipped: true, stock: product?.stock };
    }

    await step.run("send-email", async () => {
      const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
        : [];

      if (adminEmails.length === 0)
        return { skipped: true, reason: "No admin emails" };

      await sendEmail({
        to: adminEmails.join(","),
        subject: `Low Stock Alert ${product.name}`,
        body: `<p>Product ${product.name} is low in stock (${product.stock})</p>`,
      });
    });
    return { alertSent: true, product: product.name, stock: product?.stock };
  },
);

// Monthley offer email
const sendMonthlyOffer = inngest.createFunction(
  {
    id: "send-monthly-offer",
    name: "Monthly Payday Offer",
    triggers: [cron("0 10 1 * *")],
  },
  async ({ step }) => {
    const { deals, users } = await step.run(
      "fetch-deals-and-users",
      async () => {
        const products = await prisma.product.findMany({
          where: { stock: { gt: 0 } },
          orderBy: { originalPrice: "desc" },
          take: 6,
        });

        const allUsers = await prisma.user.findMany({
          select: { name: true, email: true },
        });
        return { deals: products, users: allUsers };
      },
    );

    if (users.length === 0 || deals.length === 0)
      return { skipped: true, reason: "No users or deals" };

    let sentCount = 0;

    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await step.run(`send-offers-batch-${i}`, async () => {
        for (const u of batch) {
          await sendEmail({
            to: u.email,
            subject: `Fresh pick just for you!`,
            body: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
                
                <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 24px 28px;">
                    <h2 style="color: #fff; margin: 0; font-size: 20px;">Fresh Picks Just For You!</h2>
                    <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px;">
                        Exclusive offers to kick off your month right
                    </p>
                </div>

                <div style="padding: 28px;">
                    <p style="margin: 0 0 20px; font-size: 15px; color: #374151;">
                        Hi <strong>${u.name}</strong>, check out this month's top picks!
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                        ${deals
                          .reduce((rows: any, _, i: number) => {
                            if (i % 3 === 0) {
                              rows.push(deals.slice(i, i + 3));
                            }
                            return rows;
                          }, [])
                          .map(
                            (row: any) => `
                                <tr>
                                    ${row
                                      .map(
                                        (p: any) => `
                                            <td style="width: 33%; padding: 8px; vertical-align: top;">
                                                <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; text-align: center;">
                                                    ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100px; object-fit: cover;" />` : ""}
                                                    <div style="padding: 10px;">
                                                        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">
                                                            ${p.name}
                                                        </p>
                                                        <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #16a34a;">
                                                            $${p.price.toFixed(2)}
                                                            ${p.originalPrice > p.price ? `<span style="font-size: 11px; color: #9ca3af; text-decoration: line-through; margin-left: 4px;">$${p.originalPrice.toFixed(2)}</span>` : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>`,
                                      )
                                      .join("")}
                                </tr>`,
                          )
                          .join("")}
                    </table>

                    <div style="text-align: center; margin-top: 24px;">
                        <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/products"
                           style="display: inline-block; background: #16a34a; color: #fff; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">
                           Shop All Deals →
                        </a>
                    </div>
                </div>
            </div>`,
          });
        }
      });
      sentCount += batch.length;
    }
    return { sent: sentCount };
  },
);

// Create an empty array where we'll export future Inngest functions
export const functions = [ckeckLowStock];
