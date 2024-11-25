import db from "../database/db.js";

// Create a new document
const createDocument = async (req, res) => {
  const { companyId } = req.params;
  try {
    const {
      year,
      brgyClearance,
      cedula,
      billingAssesment,
      businessPermit,
      sanitaryPermit,
      insurance,
      fireSafetyInspectionCertificate,
      secDocuments,
      vatFillings,
      annualFinancialStatement,
      certificateOfGrossReceipts,
      contractOfLeaseAndTaxDeclarations,
      secCertAuthorizationorSPA,
      affidavitOfLoss,
      listOfRegularEmployees,
    } = req.body;
    await db("checklistBusinessRenewal").insert({
      company_id: companyId,
      year,
      brgyClearance,
      cedula,
      billingAssesment,
      businessPermit,
      sanitaryPermit,
      insurance,
      fireSafetyInspectionCertificate,
      secDocuments,
      vatFillings,
      annualFinancialStatement,
      certificateOfGrossReceipts,
      contractOfLeaseAndTaxDeclarations,
      secCertAuthorizationorSPA,
      affidavitOfLoss,
      listOfRegularEmployees,
    });
    res.status(201).json({ message: "Checklist added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all documents
const getAllDocuments = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const documents = await db("checklistBusinessRenewal")
      .select("*")
      .where("company_id", companyId);
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

// Get document by ID
const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await db("documents")
      .where({ businessChecklist: id })
      .first();

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
};

// Update document
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const [updatedDocument] = await db("checklistBusinessRenewal")
      .where({ businessChecklistId: id })
      .update(updateData)
      .returning("*");

    if (!updatedDocument) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db("documents")
      .where({ businessChecklist: id })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
};

export {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};
