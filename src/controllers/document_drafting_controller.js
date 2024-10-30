import axios from "axios";
import db from "../database/db.js";
import moment from "moment";

//#region CONSTANTS

const TABLE_NAME = "documents";

const appointeeState = {
  name: "",
  id_no: "",
  date_place_issued: "",
};

const DocumentDraftingState = {
  type: "Certificate of Gross Sales/Receipts",
  corporate_name: "",
  office_address: "",
  total_revenue: "",
  date_from: "",
  date_to: "",
  year: "",
  revenue_q1: "",
  revenue_q2: "",
  revenue_q3: "",
  revenue_q4: "",
  officer_name: "",
  officer_position: "",
  officer_nationality: "",
  appointees: [appointeeState],
};

//#endregion

//#region CLASS
class DocumentDraftingClass {
  constructor({
    document_id = "",
    company_id = "",
    form_name = "",
    status = "",
    form_data = DocumentDraftingState,
    folder_id = "",
    created_by = "",
    modified_by = "",
    created_at = "",
    updated_at = "",
  } = {}) {
    this.document_id = document_id;
    this.company_id = company_id;
    this.form_name = form_name;
    this.status = status;
    this.form_data = form_data;
    this.folder_id = folder_id;
    this.created_by = created_by;
    this.modified_by = modified_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  static async fetchAll() {
    return await db(TABLE_NAME).select("*");
  }

  // Fetch records by Company ID
  static async fetchAllPerCompany(company_id) {
    return await db(TABLE_NAME).where({ company_id });
  }

  // Fetch a record by ID
  static async fetch(document_id) {
    return await db(TABLE_NAME).where({ document_id }).first();
  }

  // Add a new record
  async add() {
    // Exclude the `individuals_id`, `created_at`,`updated_at` from the insert data
    const { document_id, created_at, updated_at, ...dataToInsert } = this;
    return await db(TABLE_NAME)
      .insert(dataToInsert)
      .returning(Object.keys(this));
  }

  // Update a record
  async update() {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = MC28FormClass.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      return await db(TABLE_NAME)
        .where({ document_id: this.document_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));
    }
    return [this];
  }

  // Delete a record by ID
  static async delete(document_id) {
    return await db(TABLE_NAME).where({ document_id }).del();
  }

  // Static method to prepare fields for updates
  static getUpdateFields(instance) {
    const updates = {};
    for (const key in instance) {
      if (
        instance[key] !== undefined &&
        key !== "document_id" &&
        instance[key] !== null
      ) {
        updates[key] = instance[key] === "" ? "" : instance[key];
      }
    }
    return updates;
  }
}
//#endregion

//#region FUNCTIONS

export const getAllDocumentDrafts = async (req, res) => {
  try {
    const records = await DocumentDraftingClass.fetchAll();
    if (records) {
      res.json(records);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getDocumentDraftsPerCompany = async (req, res) => {
  const { company_id } = req.params; // Extracting the Company ID from the request parameters

  try {
    const records = await DocumentDraftingClass.fetchAllPerCompany(company_id);
    if (records) {
      res.json(records);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getDocumentDraft = async (req, res) => {
  const { company_id, document_id } = req.params; // Extracting the user ID from the request parameters

  try {
    const record = await DocumentDraftingClass.fetch(document_id);
    if (record) {
      res.json(record);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const addDocumentDraft = async (req, res) => {
  const { company_id } = req.params;

  const data = req.body;

  let form_name = `${data.form_data.type} ${moment().format(
    "MMDDYYYYhhmmssA"
  )}`;

  let body = { ...req.body };

  body.form_name = form_name;

  try {
    const record = new DocumentDraftingClass({
      ...body,
      company_id: company_id,
    });
    let response = await record.add();
    res.status(201).json(response[0]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const updateDocumentDrafts = async (req, res) => {
  const { company_id, document_id } = req.params;
  try {
    const existingRecord = await DocumentDraftingClass.fetch(document_id);

    if (existingRecord) {
      const updatedRecord = new DocumentDraftingClass({
        ...existingRecord,
        ...req.body,
        document_id: document_id,
      });
      let response = await updatedRecord.update();
      res.json(response[0]);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteDocumentDrafts = async (req, res) => {
  const { document_id } = req.params;
  try {
    await DocumentDraftingClass.delete(document_id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const generateDocument = async (req, res) => {
  let url =
    "https://script.google.com/a/macros/fullsuite.ph/s/AKfycbyS2gGq8wg-Sx0NOtpY-56iomuB0ZRiSUJ0DppZWv7gD7KYzFEULl4nmV_PTS_2m9my-w/exec";

  try {
    let response = await axios.get(url, {
      params: {
        company_id: req.query.company_id,
        document_id: req.query.document_id,
      },
    });

    if (response.status === 200) {
      res.send(response.data);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//#endregion
