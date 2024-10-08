import express from "express";

import { viewMainDashboard } from "../controllers/main_dashboard_controller.js";

const router = express.Router();

router.get("/main-dashboard/", viewMainDashboard);

export default router;
