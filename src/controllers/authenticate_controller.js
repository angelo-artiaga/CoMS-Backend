import { encodeToken } from "../utils/token.js";
import cookie from "cookie";

const createSession = (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("accessToken", req.session.passport.user.jwtAccessToken, {
      // XSRF-TOKEN is the name of your cookie
      sameSite: "lax", // lax is important, don't use 'strict' or 'none'
      httpOnly: process.env.ENVIRONMENT !== "development", // must be true in production
      path: "/",
      secure: process.env.ENVIRONMENT !== "development", // must be true in production
      maxAge: 60 * 60 * 24 * 7 * 52, // 1 year
      domain: process.env.ENVIRONMENT === "development" ? "" : `.example.com`, // the period before is important and intentional
    })
  );
  res.redirect(`${process.env.CLIENT_URL}/company`);
};

const destroySession = (req, res) => {
  req.session.destroy();
  // req.logout();
  res.json({ message: "user logged out!" });
};

export { createSession, destroySession };
