import { encodeToken } from "../utils/token.js";

const createSession = (req, res) => {
  const token = encodeToken("accessToken", req.session.accessToken);
  req.session.user = req.user;
  req.session.user.jwtAccessToken = token;
  // console.log(req.session);
  res
    .status(200)
    .send(
      `<script>window.location.href="http://localhost:5173/company"</script>`
    );
};

const destroySession = (req, res) => {
  req.session.destroy();
  // req.logout();
  res.json({ message: "user logged out!" });
};

export { createSession, destroySession };
