import express from "express";
import passport from "passport";
import {
  createSession,
  destroySession,
} from "../controllers/authenticate_controller.js";
import isAuthenticated from "../utils/isAuth.js";
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/authorized",
    failureRedirect: "/unauthorized",
  })
);

router.get("/authorized", isAuthenticated, createSession);
router.get("/logout", isAuthenticated, destroySession);

export default router;
