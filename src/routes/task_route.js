import express from "express";
import {
  createTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
  getAllAssigneeTask,
} from "../controllers/task_controller.js";

const router = express.Router();

router.route("/task/:companyId").get(getAllTask).post(createTask);
router
  .route("/task/:companyId/:id")
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

router.route("/assignee/:taskAssigneeId").get(getAllAssigneeTask);

export default router;
