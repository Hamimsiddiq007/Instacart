import express from "express";
import { getMyDeliveries, loginDeliveryPartner } from "../controllers/delivertPartners.controller.js";

const deliveryPartnersRouter = express.Router();

deliveryPartnersRouter.post('/login', loginDeliveryPartner);
deliveryPartnersRouter.get('/my-deliveries', getMyDeliveries);