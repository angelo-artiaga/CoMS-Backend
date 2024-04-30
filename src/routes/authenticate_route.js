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

router.get("/login/success", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(200).json({ user: null });
  }
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/authorized",
    failureRedirect: "/login/failed",
  })
);

router.get("/authorized", isAuthenticated, createSession);
router.get("/logout", isAuthenticated, destroySession);

export default router;
