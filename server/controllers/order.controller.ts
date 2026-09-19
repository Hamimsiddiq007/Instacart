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

    } catch (error) {
        res.status(500).json({ message: "Error creating order" });
    }
}