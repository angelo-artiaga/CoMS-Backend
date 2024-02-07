import express from "express";
import {
  viewProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/user_controller";
const router = express.Router();

router.get("/profile/:id", viewProfile);
router.patch("/profile/update/:id", updateProfile);
router.delete("/profile/remove/:id", deleteProfile);

export default router;
