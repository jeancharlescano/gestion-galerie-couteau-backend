import { Router } from "express";
const router = Router();

import { sendMail } from "../controller/mail.controller.js";

router.post("/send", sendMail);

export default router;
