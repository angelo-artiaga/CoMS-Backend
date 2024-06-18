import express from "express";
import {
  createTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task_controller.js";

const router = express.Router();

router.route("/task").get(getAllTask).post(createTask);
router.route("/task/:id").get(getTask).patch(updateTask).delete(deleteTask);

export default router;
