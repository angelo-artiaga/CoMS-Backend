import express from "express";
import { addRole, deleteRole, getAllRoles, seeders, updateRole } from "../controllers/roles_controller.js";
const router = express.Router();

const rolesURL = "/roles";
router.get(`${rolesURL}/seeders`, seeders);
router.get(`${rolesURL}`, getAllRoles);
router.post(`${rolesURL}`, addRole);
router.patch(`${rolesURL}/:role_id`, updateRole);
router.delete(`${rolesURL}/:role_id`, deleteRole);

export default router;