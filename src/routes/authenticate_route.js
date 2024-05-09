import express from "express";
import passport from "passport";
import {
  createSession,
  destroySession,
} from "../controllers/authenticate_controller.js";
import isAuthenticated from "../utils/isAuth.js";
const router = express.Router();

import { GoogleAuth, OAuth2Client } from "google-auth-library";
import axios from "axios";

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

router.post("/auth/check", async (req, res) => {
  const { token } = req.body;

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  try {
    const tokenInfo = await oAuth2Client.getTokenInfo(token);
    res.status(200).json({ auth: true, token: tokenInfo });
  } catch (error) {
    res.status(401).json({ auth: false });
  }
});

router.post("/auth/google", async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    let response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );
    console.log(response.data); //must save user info
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

router.post("/auth/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json({ credentials });
});

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
