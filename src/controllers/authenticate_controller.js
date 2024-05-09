import { encodeToken } from "../utils/token.js";

const createSession = (req, res) => {
  let accessToken = req.session.passport.accessToken;
  const token = encodeToken("accessToken", accessToken);
  res.send(token);
};

const destroySession = (req, res) => {
  req.session.destroy();
  // req.logout();
  res.json({ message: "user logged out!" });
};

export { createSession, destroySession };
