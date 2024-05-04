import { encodeToken } from "../utils/token.js";

const createSession = (req, res) => {
  const token = encodeToken("accessToken", req.session.accessToken);
  req.session.user = req.user;
  req.session.user.jwtAccessToken = token;
  // console.log(req.session);
  res.redirect(`${process.env.CLIENT_URL}/company`);
};

const destroySession = (req, res) => {
  req.session.destroy();
  // req.logout();
  res.json({ message: "user logged out!" });
};

export { createSession, destroySession };
