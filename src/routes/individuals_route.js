import express from "express";

import {
  addIndividual,
  deleteIndividual,
  geAlltIndividuals,
  getIndividualPerCompany,
  getIndividuals,
  updateIndividual,
} from "../controllers/individuals_controller.js";
const router = express.Router();

router.route("/individuals/").get(geAlltIndividuals);
router
  .route("/individuals/:companyId")
  .get(getIndividualPerCompany)
  .post(addIndividual);
router
  .route("/individuals/:companyId/:individuals_id")
  .get(getIndividuals)
  .patch(updateIndividual)
  .delete(deleteIndividual);

export default router;
