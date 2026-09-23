import e from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

// Create orders
export const createOrder = async (req: e.Request, res: e.Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

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
        return res
          .status(404)
          .json({ message: `Product ${item.product} is out of stock` });
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

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

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
        statusHistory: [
          {
            status: "placed",
            note: "Order placed successfully",
            timestamp: new Date(),
          },
        ],
      },
    });

    if (paymentMethod === "card") {
      // Stripe payment link
    }

    res.status(201).json(order);

    // Deduct stock
    for (const item of items) {
      await prisma.product.update({
        where: {
          id: item.product,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Send order confirmation email
    for (const item of items) {
      await inngest.send({
        name: "inventory/stock.updated",
        data: { productId: item.product },
      });
    }

    await inngest.send({ name: "order/placed", data: { orderId: order.id } });
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

// Get users orders
export const getUserOrders = async (req: e.Request, res: e.Response) => {
  try {
    const { status } = req.query;
    const where: any = {
      userId: req.user!.id,
      NOT: [{ paymentMethod: "card", isPaid: false }],
    };

    if (status && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: { deliveryPartner: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

// Get single order
export const getOrder = async (req: e.Request, res: e.Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, userId: req.user!.id },
      include: {
        deliveryPartner: {
          select: { name: true, phone: true, avatar: true, vehicleType: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Error getting order" });
  }
};

// Update order status (admin)
export const updateOrderStatus = async (req: e.Request, res: e.Response) => {
  try {
    const { status, note } = req.body;
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const history = (
      Array.isArray(order.statusHistory) ? order.statusHistory : []
    ) as any[];
    history.push({
      status,
      note: note || `Order ${status.toLowerCase()}`,
      timestamp: new Date(),
    });

    const updatedOrder = await prisma.order.update({
      where: { id: req.params.id as string },
      data: { statusHistory: history },
    });

    res.status(200).json({ order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req: e.Request, res: e.Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
      include: {
        user: { select: { name: true, email: true } },
        deliveryPartner: { select: { name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error getting all orders" });
  }
};

// Get Order Location
export const getOrderLocation = async (req: e.Request, res: e.Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, userId: req.user!.id },
      select: { liveLocation: true, status: true },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ liveLocation: order.liveLocation, status: order.status });
  } catch (error) {
    res.status(500).json({ message: "Error getting order location" });
  }
};
