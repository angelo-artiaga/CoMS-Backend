import express from "express";
import {
  viewAllMembers,
  addMember,
  removeMember,
} from "../controllers/member_controller.js";
const router = express.Router();

router.get("/:org_id/member/list", viewAllMembers);
router.post("/:org_id/add-member", addMember);
router.delete("/:org_id/remove/member/:id", removeMember);

export default router;
