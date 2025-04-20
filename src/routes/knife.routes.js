import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createKnife,
  deleteKnifeById,
  getAllKnifes,
  getKnifeById,
  updateKnifeById,
} from "../controller/knife.controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/add", verifyToken, upload.single("knifePic"), createKnife);
router.get("/", getAllKnifes);
router.get("/:id", getKnifeById);
router.put("/update/:id", verifyToken,upload.single("knifePic"), updateKnifeById);
router.delete("/delete/:id", verifyToken, deleteKnifeById);

export default router;
