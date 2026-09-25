import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";


// Get user address
export const getUserAddress = async (req: Request, res: Response) => {
    const addresses = await prisma.address.findMany({
        where: {userId: req.user!.id},
        orderBy: {createdAt: "asc"}
    })
    res.json({addresses})
}

// Add address
export const addAddress = async (req: Request, res: Response) => {
    const {address, label, city, state, zip, isDefault, lat, lng} = req.body;

    if(lat === null || lng === null) {
        return res.status(400).json({message: "Location coordinates are required. Please allow location access."});
    }

    const currentAddress = await prisma.address.findMany({
        where: {userId: req.user!.id}
    })

    let makeDefault = isDefault;
    if(currentAddress.length === 0) {
        makeDefault = true;
    }
    if(makeDefault){
        await prisma.address.updateMany({
            where: {userId: req.user!.id},
            data: {isDefault: false}
        })
    }

    await prisma.address.create({
        data: {
            userId: req.user!.id,
            label,
            address,
            city,
            state,
            zip,
            isDefault: makeDefault,
            lat: Number(lat),
            lng: Number(lng)
        }
    })

    const addresses = await prisma.address.findMany({
        where: {userId: req.user!.id},
        orderBy: {createdAt: "asc"}
    })
    res.status(201).json({addresses})
}