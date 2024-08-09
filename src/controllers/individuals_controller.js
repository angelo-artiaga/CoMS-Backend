import db from "../database/db.js";

class Individuals {
  constructor({
    individuals_id = null,
    companyId = null,
    surname = null,
    given_name = null,
    middle_name = null,
    ext_name = null,
    address = null,
    nationality = null,
    date_of_birth = null,
    tax_identification_no = null,
    created_at = null,
    updated_at = null,
  } = {}) {
    this.individuals_id = individuals_id;
    this.companyId = companyId;
    this.surname = surname;
    this.given_name = given_name;
    this.middle_name = middle_name;
    this.ext_name = ext_name;
    this.address = address;
    this.nationality = nationality;
    this.date_of_birth = date_of_birth;
    this.tax_identification_no = tax_identification_no;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  static async fetchAll() {
    return await db("individuals").select("*");
  }

  // Fetch a record by ID
  static async fetchAllPerCompany(companyId) {
    return await db("individuals").where({ companyId });
  }

  // Fetch a record by ID
  static async fetch(individuals_id) {
    return await db("individuals").where({ individuals_id }).first();
  }

  // Add a new record
  async add() {
    // Exclude the `individuals_id`, `created_at`,`updated_at` from the insert data
    const { individuals_id, created_at, updated_at, ...dataToInsert } = this;
    return await db("individuals")
      .insert(dataToInsert)
      .returning(Object.keys(this));
  }

  // Update a record
  async update() {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = Individuals.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      return await db("individuals")
        .where({ individuals_id: this.individuals_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));
    }
    return [this];
  }

  // Delete a record by ID
  static async delete(individuals_id) {
    return await db("individuals").where({ individuals_id }).del();
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
        updates[key] = instance[key] === "" ? null : instance[key];
      }
    }
    return updates;
  }
}

export const geAlltIndividuals = async (req, res) => {
  try {
    const individuals = await Individuals.fetchAll();
    if (individuals) {
      res.json(individuals);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getIndividualPerCompany = async (req, res) => {
  const { companyId } = req.params; // Extracting the Company ID from the request parameters

  try {
    const individuals = await Individuals.fetchAllPerCompany(companyId);
    if (individuals) {
      res.json(individuals);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const getIndividuals = async (req, res) => {
  const { companyId, individuals_id } = req.params; // Extracting the user ID from the request parameters

  try {
    const individual = await Individuals.fetch(individuals_id);
    if (individual) {
      res.json(individual);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const addIndividual = async (req, res) => {
  const { companyId } = req.params;
  try {
    const individual = new Individuals({ ...req.body, companyId: companyId });
    let response = await individual.add();
    res.status(201).json(response[0]);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const updateIndividual = async (req, res) => {
  const { companyId, individuals_id } = req.params;
  try {
    const existingIndividual = await Individuals.fetch(individuals_id);

    if (existingIndividual) {
      const updatedIndividual = new Individuals({
        ...existingIndividual,
        ...req.body,
        individuals_id: individuals_id,
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

export const deleteIndividual = async (req, res) => {
  const { individuals_id } = req.params;
  try {
    await Individuals.delete(individuals_id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).send("Server error");
  }
};
