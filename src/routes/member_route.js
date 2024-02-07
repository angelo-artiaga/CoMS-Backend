import express from "express";
import {
  viewAllMembers,
  viewMember,
  addMember,
  removeMember,
} from "../controllers/member_controller.js";
import isAuthenticated from "../utils/isAuth.js";
const router = express.Router();

router.get("/:org_id/member/list", isAuthenticated, viewAllMembers);
router.get("/:org_id/member/:id", isAuthenticated, viewMember);
router.post("/:org_id/add-member", isAuthenticated, addMember);
router.delete("/:org_id/remove/member/:id", isAuthenticated, removeMember);

export default router;
