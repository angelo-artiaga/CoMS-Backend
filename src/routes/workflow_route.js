import express from "express";
import {
  createWorkFlow,
  getAllWorkFlow,
} from "../controllers/workflowControllers.js";

const router = express.Router();

router.route("/workflow/:companyId").post(createWorkFlow).get(getAllWorkFlow);

export default router;
