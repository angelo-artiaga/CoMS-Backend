import express from "express";
import passport from "passport";
import {
  authCheck,
  authGoogle,
  authRefreshToken,
  createSession,
  destroySession,
} from "../controllers/authenticate_controller.js";
import isAuthenticated from "../utils/isAuth.js";


const router = express.Router();


router.post("/auth/check", authCheck);

router.post("/auth/google", authGoogle);

router.post("/auth/google/refresh-token", authRefreshToken);

// router.post(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// router.get("/login/failed", (req, res) => {
//   res.status(200).json("Login Failed");
// });

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/authorized",
//     failureRedirect: "/login/failed",
//     keepSessionInfo: true,
//   })
// );

// router.get("/authorized", isAuthenticated, createSession);
// router.get("/logout", isAuthenticated, destroySession);

export default router;
