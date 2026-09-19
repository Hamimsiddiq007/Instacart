import express from "express";
import auth from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        
    } catch (error) {
        
    }
})