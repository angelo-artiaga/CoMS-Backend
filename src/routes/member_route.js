import express from "express";
import {
  viewAllMembers,
  viewMember,
  addMember,
  removeMember,
} from "../controllers/member_controller.js";
import isAuthenticated from "../utils/isAuth.js";
const router = express.Router();

router.get("/member/list", isAuthenticated, viewAllMembers);
router.get("/member/:id", isAuthenticated, viewMember);
router.post("/add-member", isAuthenticated, addMember);
router.delete("/remove/member", isAuthenticated, removeMember);

export default router;
