import express from "express";
const router = express.Router();

import {
  getAllRecords,
  getRecord,
  updateRecord,
  createRecord,
  deleteRecord,
  getAllCompanyRecords,
} from "../controllers/recordControllers.js";

router.route("/record").get(getAllRecords).post(createRecord);
router.route("/record/:companyId").get(getAllCompanyRecords);
router
  .route("/record/:id")
  .get(getRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

export default router;
