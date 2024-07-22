import express from "express";
import {
  createTask,
  getAllTask,
  getTask,
  updateTask,
  deleteTask,
  getAllAssigneeTask,
  getAllCompanyTask,
} from "../controllers/task_controller.js";
import sendMessageMiddleware from "../middleware/sendMessageMiddleware.js";
import createBlocks from "../slack-block/createBlocks.js";

const router = express.Router();

router
  .route("/task/:companyId")
  .get(getAllCompanyTask)
  .post(sendMessageMiddleware(createBlocks), createTask);
router
  .route("/task/:companyId/:id")
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

router.route("/tasks/:assignee").get(getAllAssigneeTask);
router.route("/tasks").get(getAllTask);


export default router;
