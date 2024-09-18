import express from "express";
import {
  addFinalDocs,
  checkWarnings,
  getAllFinalDocs,
} from "../controllers/finaldocs_controllers.js";
const router = express.Router();

router.route("/finaldocs/:companyId").get(getAllFinalDocs).post(addFinalDocs);
router.route("/check-warnings/:companyId").get(checkWarnings);

export default router;
