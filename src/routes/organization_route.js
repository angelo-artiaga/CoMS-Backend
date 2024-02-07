import express from "express";
import {
  viewAllOrg,
  viewOrg,
  createOrg,
  editOrg,
  removeOrg,
} from "../controllers/organization_controller.js";
import isAuthenticated from "../utils/isAuth.js";
const router = express.Router();

router.get("/org/list", isAuthenticated, viewAllOrg);
router.get("/org/:id", isAuthenticated, viewOrg);
router.post("/create/org", isAuthenticated, createOrg);
router.patch("/edit/org/:org_id", isAuthenticated, editOrg);
router.delete("/remove/org/:org_id", isAuthenticated, removeOrg);

export default router;
