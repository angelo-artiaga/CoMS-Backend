import express from "express";
const router = express.Router();

import {
  getAllRecords,
  getRecord,
  updateRecord,
  createRecord,
  deleteRecord,
} from "../controllers/recordControllers.js";

router.route("/record").get(getAllRecords).post(createRecord);
router
  .route("/record/:id")
  .get(getRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

export default router;
