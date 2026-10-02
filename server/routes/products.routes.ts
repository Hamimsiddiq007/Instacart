import express from "express";
import {
  createProduct,
  getFlashDeals,
  getProduct,
  getProducts,
  updateProduct,
  updateStock,
} from "../controllers/products.controller.js";
import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";

const productRouter = express.Router();

productRouter.get("/flash-deals", getFlashDeals);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.post("/", auth, admin, createProduct);
productRouter.put("/:id", auth, admin, updateProduct);
productRouter.put("/:id/stock", auth, admin, updateStock);

export default productRouter;
