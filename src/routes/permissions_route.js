import express from "express";
import { addPermission, deletePermission, getAllPermissions, updatePermission } from "../controllers/permissions_controller.js";
const router = express.Router();

const permissionsURL = "/permissions";
router.get(`${permissionsURL}`, getAllPermissions);
router.post(`${permissionsURL}`, addPermission);
router.patch(`${permissionsURL}/:permission_id`, updatePermission);
router.delete(`${permissionsURL}/:permission_id`, deletePermission);

export default router;