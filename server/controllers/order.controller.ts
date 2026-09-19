import e from "express";
import { prisma } from "../config/prisma.js";

// Create orders
export const createOrder = async (req: e.Request, res: e.Response) => {
    try {
        const {items, shippingAddress, paymentMethod} = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        const productIds = items.map((item: any) => item.product);
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
        });

        const productMap: Record<string, (typeof products)[0]> = {};

        products.forEach((product: any) => (productMap[product.id] = product));

        for (const item of items) {
            const product = productMap[item.product];
            if (!product || (product.stock ?? 0) < item.quantity) {
                return res.status(404).json({ message: `Product ${item.product} is out of stock` });
            }
        }

    } catch (error) {
        res.status(500).json({ message: "Error creating order" });
    }
}