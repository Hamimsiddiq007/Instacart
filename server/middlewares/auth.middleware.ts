import { NextFunction, Request, Response } from "express";
import  Jwt  from "jsonwebtoken";

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Authorization header is missing or invalid");
        }

        const token = authHeader.split(" ")[1];
        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired token"});
    }
}