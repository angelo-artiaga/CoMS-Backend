import express from "express";
const router = express.Router();

import {
  getAllRecords,
  getRecord,
  updateRecord,
  createRecord,
  deleteRecord,
  getAllCompanyRecords,
  getCurrentDirectors,
} from "../controllers/recordControllers.js";

router.route("/record").get(getAllRecords).post(createRecord);
router.route("/record/current/:companyId").get(getCurrentDirectors);
router.route("/record/company/:companyId").get(getAllCompanyRecords);
router
  .route("/record/:recordId")
  .get(getRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

export default router;
