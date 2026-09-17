import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";


// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: {stock: {gt: 0}},
        orderBy: {originalPrice: "desc"},
    });

    const productsWithDiscount = products.map((product: any) => {
        const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        return {...product, discount};
    });

    res.json({products: productsWithDiscount.slice(0, 8)});
}