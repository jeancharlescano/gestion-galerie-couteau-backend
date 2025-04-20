import { Router } from "express";

import auth from "./auth.routes.js";
import knife from "./knife.routes.js";

const router = Router();

router.use("/auth", auth);
router.use("/knife", knife);

export default router;
