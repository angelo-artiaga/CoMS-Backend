import express from "express";
import {
  createDocs,
  deleteDocs,
  getAllDocs,
  getDocs,
  updateDocs,
} from "../controllers/finaldocs_controllers";
const router = express.Router();

router.route("/").get(getAllDocs).post(createDocs);
router.route("/:id").get(getDocs).put(updateDocs).delete(deleteDocs);

export default router;
