import express from "express";
import session from "express-session";
import organization_route from "./routes/organization_route.js";
import member_route from "./routes/member_route.js";
import authenticate_route from "./routes/authenticate_route.js";
import user_route from "./routes/user_route.js";
import companyRoute from "./routes/companyRoutes.js";
import recordRoute from "./routes/recordRoutes.js";
import board_meetings_route from "./routes/board_meetings_route.js";
import finaldocs_route from "./routes/finaldocs_routes.js";
import roles_route from "./routes/roles_route.js";
import permission_route from "./routes/permissions_route.js";
import task_route from "./routes/task_route.js";
import workflow_route from "./routes/workflow_route.js";
import individuals_route from "./routes/individuals_route.js";
import db from "./database/db.js";
import cors from "cors";
import "./utils/auth.js";
import passport from "passport";
import moment from "moment";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    rolling: true,
    cookie: {
      expires: 60 * 60 * 24,
      secure: process.env.ENVIRONMENT !== "development",
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: [process.env.LOCALHOST_CLIENT_URL, process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json({ limit: "20mb" })); //file size limit
app.use(authenticate_route);
app.use(organization_route);
app.use(member_route);
app.use(companyRoute);
app.use(recordRoute);
app.use(user_route);
app.use(board_meetings_route);
app.use(finaldocs_route);
app.use(roles_route);
app.use(permission_route);
app.use(task_route);
app.use(workflow_route);
app.use(individuals_route);
app.get("/", (req, res) => {
  db("users")
    .select("*")
    .where("first_name", 2)
    .then((rows) => {
      console.log(rows);
    });
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
