// routes/documentsRoutes.js

import express from "express";

import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/business_renewal_controllers.js";

const router = express.Router();

// Create a new document
router.post(`/renewal-checklist/:companyId`, createDocument);

// Get all documents
router.get("/renewal-checklist/:companyId", getAllDocuments);

// Get document by ID
router.get("/documents/:id", getDocumentById);

// Update document
router.put("/checklist-update/:id", updateDocument);

// Delete document
router.delete("/documents/:id", deleteDocument);

export default router;
