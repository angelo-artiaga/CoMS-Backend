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
  getLatestGIS,
  generateGIS,
} from "../controllers/recordControllers.js";

router.route("/record").get(getAllRecords).post(createRecord);
router.route("/record/current/:companyId").get(getCurrentDirectors);
router.route("/record/currentGIS/:companyId").get(getLatestGIS);
router.route("/record/company/:companyId").get(getAllCompanyRecords);
router
  .route("/record/record/:recordId")
  .get(getRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

router.route("/record/generate/:recordId").get(generateGIS);

export default router;
