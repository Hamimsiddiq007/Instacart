import express from "express";
import auth from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: "No image uploaded" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error uploading image" });
    }
})