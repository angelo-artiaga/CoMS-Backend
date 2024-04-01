import express from "express";
import {
  createSession,
  destroySession,
} from "../controllers/authenticate_controller.js";
import isAuthenticated from "../utils/isAuth.js";
const router = express.Router();

router.get("/authorized", isAuthenticated, createSession);
router.get("/logout", isAuthenticated, destroySession);

export default router;
