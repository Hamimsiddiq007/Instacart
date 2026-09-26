import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

// Get admin dashboard data
export const getAdminStats = async (req: Request, res: Response) => {
  const [
    totalOrders,
    totalUsers,
    totalProducts,
    outOfStock,
    totalPartners,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({
      where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
    }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.deliveryPartner.count(),
    prisma.order.findMany({
      where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true, email: true } },
        deliveryPartner: { select: { name: true, phone: true } },
      },
    }),
  ]);
  res.status(200).json({
    totalOrders,
    totalUsers,
    totalProducts,
    outOfStock,
    totalPartners,
    recentOrders,
  });
};

// Get delivery partners list for admin
export const getDeliveryPartners = async (req: Request, res: Response) => {
  const deliveryPartners = await prisma.deliveryPartner.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ deliveryPartners });
};

// Create delivery partners profile
export const createDeliveryPartner = async (req: Request, res: Response) => {
    const {name, email, password, phone, vehicleType} = req.body;

    if (!name || !email || !password || !phone || !vehicleType) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = await prisma.deliveryPartner.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            vehicleType,
        }
    })

    res.status(201).json({ partner });
};

// Update delivery partner profile
export const updateDeliveryPartner = async (req: Request, res: Response) => {
    const {name, phone, vehicleType, isActive} = req.body;
    const data: any = {};

    if(name) data.name = name;
    if(phone) data.phone = phone;
    if(vehicleType) data.vehicleType = vehicleType;
    if(isActive) data.isActive = isActive;

    try {
        const partner = await prisma.deliveryPartner.update({
            where: {id: req.params.id as string},
            data
        })

        res.status(200).json({ partner });
    } catch (error) {
        res.status(500).json({ message: "Error updating delivery partner" });
    }
}