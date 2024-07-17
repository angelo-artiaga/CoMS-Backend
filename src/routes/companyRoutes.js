import express from "express";
const router = express.Router();
import uploadMulter from "../utils/multereFileHandler.js";

import {
  createCompany,
  getAllCompany,
  updateCompany,
  deleteCompany,
  getCompany,
  changeStatus,
  getPaginateCompany,
  updateLetterHeader,
} from "../controllers/companyControllers.js";

// router.route("/company/").post(createCompany).get(getAllCompany);
router.get("/company", getAllCompany);
router.get("/paginateCompany", getPaginateCompany);
router.post("/company", uploadMulter.single("logo"), createCompany);
router.patch("/company/:id", uploadMulter.single("logo"), updateCompany);
router.patch("/company/:id/changeStatus", changeStatus);
router.patch("/company/:id/updateLetterHeader", updateLetterHeader);

router
  .route("/company/:id")
  .get(getCompany)
  // .patch(updateCompany)
  .delete(deleteCompany);

export default router;
