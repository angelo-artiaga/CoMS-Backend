import axios from "axios";
import db from "../database/db.js";
const MC28FormDataState = {
  type: "New",
  corporate_name: "",
  sec_registration_number: "",
  official_email_address: "",
  official_mobile_number: "",
  alternative_email_address: "",
  alternative_mobile_number: "",

  old_email1: "",
  new_email1: "",
  is_official_email1: false,
  is_alternate_email1: false,
  old_email2: "",
  new_email2: "",
  is_official_email2: false,
  is_alternate_email2: false,
  old_phone_number1: "",
  new_phone_number1: "",
  is_official_phone_number1: false,
  is_alternate_phone_number1: false,
  old_phone_number2: "",
  new_phone_number2: "",
  is_official_phone_number2: false,
  is_alternate_phone_number2: false,

  auth_name: "",
  office_address: "",
  date_of_resolution: "",
};

class MC28FormClass {
  constructor({
    form_id = "",
    company_id = "",
    form_name = "",
    status = "",
    form_data = MC28FormDataState,
    folder_id = "",
    created_by = "",
    modified_by = "",
    created_at = "",
    updated_at = "",
  } = {}) {
    this.form_id = form_id;
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
    return await db("mc28forms").select("*");
  }

  // Fetch a record by ID
  static async fetchAllPerCompany(company_id) {
    return await db("mc28forms").where({ company_id });
  }

  // Fetch a record by ID
  static async fetch(form_id) {
    return await db("mc28forms").where({ form_id }).first();
  }

  // Add a new record
  async add() {
    // Exclude the `individuals_id`, `created_at`,`updated_at` from the insert data
    const { form_id, created_at, updated_at, ...dataToInsert } = this;
    return await db("mc28forms")
      .insert(dataToInsert)
      .returning(Object.keys(this));
  }

  // Update a record
  async update() {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = MC28FormClass.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      return await db("mc28forms")
        .where({ form_id: this.form_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));
    }
    return [this];
  }

  // Delete a record by ID
  static async delete(form_id) {
    return await db("mc28forms").where({ form_id }).del();
  }

  // Static method to prepare fields for updates
  static getUpdateFields(instance) {
    const updates = {};
    for (const key in instance) {
      if (
        instance[key] !== undefined &&
        key !== "individuals_id" &&
        instance[key] !== null
      ) {
        updates[key] = instance[key] === "" ? "" : instance[key];
      }
    }
    return updates;
  }
}

export const getAllMC28Forms = async (req, res) => {
  try {
    const mc28forms = await MC28FormClass.fetchAll();
    if (mc28forms) {
      res.json(mc28forms);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getMC28FormsPerCompany = async (req, res) => {
  const { company_id } = req.params; // Extracting the Company ID from the request parameters

  try {
    const mc28forms = await MC28FormClass.fetchAllPerCompany(company_id);
    if (mc28forms) {
      res.json(mc28forms);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getMC28Form = async (req, res) => {
  const { company_id, form_id } = req.params; // Extracting the user ID from the request parameters

  try {
    const mc28forms = await MC28FormClass.fetch(form_id);
    if (mc28forms) {
      res.json(mc28forms);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const addMC28Form = async (req, res) => {
  const { company_id } = req.params;

  const data = req.body;

  let form_name = `${data.form_data.corporate_name} MC28 Form Annex ${
    data.form_data.type == "New" ? "D" : "G"
  } ${new Date().getFullYear()}`;

  let body = { ...req.body };

  body.form_name = form_name;

  try {
    const individual = new MC28FormClass({
      ...body,
      company_id: company_id,
    });
    let response = await individual.add();
    res.status(201).json(response[0]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const updateMC28Form = async (req, res) => {
  const { company_id, form_id } = req.params;
  try {
    const existingIndividual = await MC28FormClass.fetch(form_id);

    if (existingIndividual) {
      const updatedIndividual = new MC28FormClass({
        ...existingIndividual,
        ...req.body,
        form_id: form_id,
      });
      let response = await updatedIndividual.update();
      res.json(response[0]);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteMC28Form = async (req, res) => {
  const { form_id } = req.params;
  try {
    await MC28FormClass.delete(form_id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const generateMC28Form = async (req, res) => {
  let url =
    "https://script.google.com/a/macros/fullsuite.ph/s/AKfycby4BrIfOjydZfdLcExAjYe3yc78MLS66hALSpjKWbKrWN75-t7LiVNXWdcqQ6HzVwzs/exec";

  try {
    let response = await axios.get(url, {
      params: {
        formData: req.query.formData,
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
