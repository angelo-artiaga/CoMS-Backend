import express from "express";

import {
  addDocumentDraft,
  deleteDocumentDrafts,
  generateDocument,
  getAllDocumentDrafts,
  getDocumentDraft,
  getDocumentDraftsPerCompany,
  updateDocumentDrafts,
} from "../controllers/document_drafting_controller.js";
const router = express.Router();

router.route("/document-drafting/").get(getAllDocumentDrafts);
router
  .route("/document-drafting/:company_id")
  .get(getDocumentDraftsPerCompany)
  .post(addDocumentDraft);

router
  .route("/document-drafting/:company_id/:document_id")
  .get(getDocumentDraft)
  .patch(updateDocumentDrafts)
  .delete(deleteDocumentDrafts);

router.route("/document-drafting-generate").get(generateDocument);

export default router;
