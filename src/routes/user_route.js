import express from "express";
import {
  createProfile,
  viewProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/user_controller.js";
const router = express.Router();

router.post("/create-user", createProfile);
router.get("/profile/:id", viewProfile);
router.patch("/profile/update/:id", updateProfile);
router.delete("/profile/remove/:id", deleteProfile);

export default router;
