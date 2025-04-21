import { Router } from "express";

import auth from "./auth.routes.js";
import knife from "./knife.routes.js";
import mail from "./mail.routes.js";

const router = Router();

router.use("/auth", auth);
router.use("/knife", knife);
router.use("/mail", mail);

export default router;
