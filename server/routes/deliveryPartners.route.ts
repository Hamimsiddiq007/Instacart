import express from "express";
import {
  cancelDelivery,
  completeDelivery,
  getDeliveryDetails,
  getMyDeliveries,
  loginDeliveryPartner,
  updateLiveLocation,
} from "../controllers/delivertPartners.controller.js";
import deliveryAuth from "../middlewares/deliveryPartner.middleware.js";

const deliveryPartnersRouter = express.Router();

deliveryPartnersRouter.post("/login", loginDeliveryPartner);
deliveryPartnersRouter.get("/my-deliveries", deliveryAuth, getMyDeliveries);
deliveryPartnersRouter.get(
  "/my-deliveries/:id",
  deliveryAuth,
  getDeliveryDetails,
);
deliveryPartnersRouter.get(
  "/my-deliveries/:id",
  deliveryAuth,
  getDeliveryDetails,
);
deliveryPartnersRouter.put(
  "/my-deliveries/:id/complete",
  deliveryAuth,
  completeDelivery,
);
deliveryPartnersRouter.put(
  "/my-deliveries/:id/cancel",
  deliveryAuth,
  cancelDelivery,
);
deliveryPartnersRouter.put(
  "/my-deliveries/:id/location",
  deliveryAuth,
  updateLiveLocation,
);

export default deliveryPartnersRouter;
