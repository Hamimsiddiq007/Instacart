import express from "express";
import auth from "../middlewares/auth.middleware.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({ message: "No image uploaded" });
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "instacart",
            resource_type: "auto",
        });

    } catch (error) {
        res.status(500).json({ message: "Error uploading image" });
    }
})