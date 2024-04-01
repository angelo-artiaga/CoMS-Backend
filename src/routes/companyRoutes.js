import express from "express";
const router = express.Router();
import uploadMulter from "../utils/multereFileHandler.js";

import {
  createCompany,
  getAllCompany,
  updateCompany,
  deleteCompany,
  getCompany,
  changeStatus
} from "../controllers/companyControllers.js";


// router.route("/company/").post(createCompany).get(getAllCompany);
router.get("/company", getAllCompany);
router.post("/company", uploadMulter.single("logo"), createCompany);
router.patch("/company/:id", uploadMulter.single("logo"), updateCompany);
router.patch("/company/:id/changeStatus", changeStatus);

router
  .route("/company/:id")
  .get(getCompany)
  // .patch(updateCompany)
  .delete(deleteCompany);

export default router;
