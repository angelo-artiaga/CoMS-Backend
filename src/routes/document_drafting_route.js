import express from "express";

import { generateDocument } from "../controllers/document_drafting_controller.js";
const router = express.Router();

// router.route("/document-drafting/").get(getAllMC28Forms);
// router
//   .route("/document-drafting/:company_id")
//   .get(getMC28FormsPerCompany)
//   .post(addMC28Form);

// router
//   .route("/document-drafting/:company_id/:form_id")
//   .get(getMC28Form)
//   .patch(updateMC28Form)
//   .delete(deleteMC28Form);

router.route("/document-drafting-generate").get(generateDocument);

export default router;
