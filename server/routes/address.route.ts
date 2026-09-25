import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  addAddress,
  deleteAddress,
  getUserAddress,
  updateAddress,
} from "../controllers/address.controller.js";

const addressRouter = express.Router();

addressRouter.get("/", auth, getUserAddress);
addressRouter.post("/", auth, addAddress);
addressRouter.put("/", auth, updateAddress);
addressRouter.delete("/:id", auth, deleteAddress);

export default addressRouter;
