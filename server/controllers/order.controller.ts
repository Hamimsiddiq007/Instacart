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

        const orderItems = items.map((item: any) => {
            const dbProduct = productMap[item.product];
            if (!dbProduct) throw new Error(`Product ${item.product} not found`);
            return {
                product: dbProduct.id,
                name: dbProduct.name,
                image: dbProduct.image,
                price: dbProduct.price,
                quantity: item.quantity,
                unit: dbProduct.unit,
            };
        });

        const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        const deliveryFee = subtotal > 20 ? 0 : 1.99;
        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const total = Math.round((subtotal + delivaryFee + tax) * 100) / 100;

        const order = await prisma.order.create({
            data: {
                userId: req.user!.id,
                items: orderItems,
                shippingAddress,
                paymentMethod,
                subtotal,
                deliveryFee,
                tax,
                total,
                statusHistory: [{status: "placed", note: "Order placed successfully", timestamp: new Date()}],
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Error creating order" });
    }
}