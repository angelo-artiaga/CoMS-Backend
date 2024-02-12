import express from "express";
import {
  viewAllOrg,
  viewOrg,
  createOrg,
  editOrg,
  removeOrg,
} from "../controllers/organization_controller.js";
const router = express.Router();

router.get("/org/list", viewAllOrg);
router.get("/org/:id", viewOrg);
router.post("/create/org", createOrg);
router.patch("/edit/org/:org_id", editOrg);
router.delete("/remove/org/:org_id", removeOrg);

export default router;
