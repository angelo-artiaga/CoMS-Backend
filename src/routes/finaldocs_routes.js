import express from "express";
import {
  addFinalDocs,
  getAllFinalDocs,
} from "../controllers/finaldocs_controllers.js";
const router = express.Router();

router.route("/finaldocs/:companyId").get(getAllFinalDocs).post(addFinalDocs);

export default router;
