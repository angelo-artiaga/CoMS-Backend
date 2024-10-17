import express from "express";

import {
  addMC28Form,
  deleteMC28Form,
  generateMC28Form,
  getAllMC28Forms,
  getMC28Form,
  getMC28FormsPerCompany,
  updateMC28Form,
} from "../controllers/mc28form_controller.js";
const router = express.Router();

router.route("/mc28forms/").get(getAllMC28Forms);
router
  .route("/mc28forms/:company_id")
  .get(getMC28FormsPerCompany)
  .post(addMC28Form);
router
  .route("/mc28forms/:company_id/:form_id")
  .get(getMC28Form)
  .patch(updateMC28Form)
  .delete(deleteMC28Form);

router.route("/mc28forms-generate").get(generateMC28Form);

export default router;
