import express from "express";
import {
  viewGis,
  viewAllGis,
  updateGis,
  uploadGis,
  deleteGis,
} from "../controllers/gis_controller";
const router = express.Router();

router.get("/gis/:id", viewGis);
router.get("/gis/list", viewAllGis);
router.patch("/gis/update/:id", updateGis);
router.post("/gis-upload", uploadGis);
router.delete("/gis/delete", deleteGis);

export default router;
