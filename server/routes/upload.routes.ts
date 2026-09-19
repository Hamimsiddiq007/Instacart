import express from "express";
import auth from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        
    } catch (error) {
        
    }
})