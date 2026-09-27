import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const deliveryAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    if (decoded.role !== "delivery") {
      return res
        .status(403)
        .json({ message: "Access denied. Delivery partner only" });
    }

    const partner = await prisma.deliveryPartner.findUnique({
      where: { id: decoded.id },
    });

    if (!partner || !partner.isActive) {
      return res
        .status(403)
        .json({ message: "Your account has been disabled" });
    }

    req.partner = partner;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default deliveryAuth;
