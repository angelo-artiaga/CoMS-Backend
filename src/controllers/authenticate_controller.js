import { encodeToken } from "../utils/token.js";

import { GoogleAuth, OAuth2Client } from "google-auth-library";
import axios from "axios";
import db from "../database/db.js";
import moment from "moment";

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

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

const authCheck = async (req, res) => {
  const { access_token } = req.body;

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  try {
    const tokenInfo = await oAuth2Client.getTokenInfo(access_token);
    if (tokenInfo.exp < Date.now() / 1000) {
      return res.status(401).json({ auth: false, message: "Token expired" });
    }
    const user = await db("users")
      .select("*")
      .where("users.email", tokenInfo.email);

    const user_roles = await db("user_roles").select("*").where("user_id", user[0].user_id);

    let permissions = [];
    let roles = [];
    if(user_roles.length > 0){
      roles = await db("roles").select("role_name", "role_id").where("role_id", user_roles[0].role_id);
      if (roles.length > 0) {
        permissions = await db("role_permissions").select("*")
          .where("role_id", roles[0].role_id)
          .join("permissions", "permissions.permission_id", "role_permissions.permission_id").pluck("permission_name");
      }
    }

    user[0].roles = roles;
    user[0].permissions = permissions;

    if (user.length === 1) {
      if (access_token != user[0].token) {
        return res.status(401).json({ auth: false, message: "Invalid Token" });
      }
      res.status(200).json({ auth: true, user: user[0], access_token });
    } else {
      return res.status(401).json({ auth: false, message: "User not found." });
    }
  } catch (error) {
    res.status(401).json({ auth: false, message: error });
  }
};

const authGoogle = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    let response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );
    // console.log(response.data); //must save user info
    const { access_token, refresh_token } = tokens;
    const { email, given_name, family_name } = response.data;

    const user = await db("users").select("*").where("email", email);

    if (user.length === 0) {
      let toInsert = {
        email: email,
        first_name: given_name,
        // middle_name,
        last_name: family_name,
        last_login: new Date().toLocaleString(),
        status: "Active",
        token: access_token,
        refresh_token: refresh_token,
      };
      const newuser = await db("users")
        .insert(toInsert)
        .returning([
          "user_id",
          "email",
          "first_name",
          "middle_name",
          "last_name",
          "token",
          "refresh_token",
        ]);
      if (newuser.length > 0) {
        res.status(200).json({ success: true, tokens, user: newuser[0] });
      } else {
        res.status(422).json({
          success: false,
          message: "Failed to insert user in the Database.",
        });
      }
    } else {

      if (user[0].status == "Inactive") {
        return res.status(200).json({ success: false, tokens, error: "Status: Inactive" });
      }
      const updateuser = await db("users")
        .update({
          token: access_token,
          last_login: moment().format('MMMM Do YYYY, h:mm:ss a'),
          refresh_token: refresh_token,
        })
        .where("user_id", user[0].user_id)
        .returning([
          "user_id",
          "email",
          "first_name",
          "middle_name",
          "last_name",
          "token",
          "refresh_token",
        ]);
      res.status(200).json({ success: true, tokens, user: updateuser });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

const authRefreshToken = async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken(); // optain new tokens
  res.json({ credentials });
};

export {
  createSession,
  destroySession,
  authCheck,
  authGoogle,
  authRefreshToken,
};
