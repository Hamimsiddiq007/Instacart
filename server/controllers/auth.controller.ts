import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET as string, {expiresIn: "30d"});
}

// Register
export const register = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    const existingUser = await prisma.user.findUnique({where: {email: email.toLowerCase()}});

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        }
    })
}