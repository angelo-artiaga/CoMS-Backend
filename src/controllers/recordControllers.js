import db from "../database/db.js";

const getAllRecords = async (req, res) => {
  try {
    const data = await db("records").select("*");
    res.status(200).json(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const getAllCompanyRecords = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("records").select("*").where("companyId", companyId);
    if (data.length >= 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No Records Found." });
    }
  } catch (e) {
    //returns 500 status code
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

const createRecord = async (req, res) => {
  const {
    companyId,
    recordId,
    // recordName,
    status,
    draftingInput,

    createdBy,
  } = req.body;

  try {

    // let toInsert = {
    //   companyId: companyId,
    //   recordName: recordName,
    //   status: status,
    //   draftingInput: JSON.stringify(draftingInput),
    //   createdBy: createdBy,
    // };

    //check company if exist
    const companies = await db("companies")
      .select("*")
      .where("companyId", companyId);


    if (companies.length == 1) {
      //add to db if company ID exists

      //company details
      let company = companies[0];

      //record name
      let recordName = `${draftingInput.corporate_name} GIS ${draftingInput.year}`;

      if (draftingInput.corporate_name === "" || draftingInput.year === "") {
        recordName = `${company.companyName} GIS ${new Date().getFullYear()}`;
      }

      //Create an object
      let record = {
        companyId: company.companyId,
        recordName: recordName,
        status: status,
        draftingInput: JSON.stringify(draftingInput),
        // pdfInput: JSON.stringify(pdfInput),
        // pdfFileLink: pdfFileLink,
        // secFileLink: secFileLink,
        createdBy: createdBy,
      };

      // //Checks the status then append the user input based on its status
      // if (status == "Saved as Draft") {
      //   record.draftingInput = JSON.stringify(draftingInput);
      // }

      // //Checks the status then append the user input based on its status
      // if (status == "Pending for Approval") {
      //   record.pdfInput = JSON.stringify(pdfInput);
      // }

      if (recordId !== "") {
        //Update if the record is existing.

        //insert query to add record object in db
        let update = await db("records")
          .where("recordId", recordId)
          .update(record);

        //checks if the data or the query was inserted
        if (update) {
          res.status(200).json(record);
        } else {
          res
            .status(500)
            .send({ error: `Failed to insert the record in the database.` });
        }
      } else {
        //else, insert the record.

        //insert query to add record object in db
        let insert = await db("records").insert(record);

        //checks if the data or the query was inserted
        if (insert) {
          res.status(200).json(record);
        } else {
          res
            .status(500)
            .send({ error: `Failed to insert the record in the database.` });
        }
      }
    } else {
      //return 404 status code if company ID does not exists
      res.status(404).json({ error: `Company ID: ${companyId} is not found.` });
    }
  } catch (e) {
    //returns 500 status code
    res.status(500).json({ error: "Internal Server Error", err_msg: e });
  }
};

const getRecord = async (req, res) => {
  const recordId = req.params.recordId;

  try {
    const data = await db("records").select("*").where("recordId", recordId);
    if (data.length >= 1) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Record ID does not exists." });
    }
  } catch (e) {
    //returns 500 status code
    res.status(500).json({ error: "Internal Server Error", err_msg: e });
  }
};

const updateRecord = async (req, res) => {
  const recordId = req.params.id;
  const {
    recordName,
    status,
    draftingInput,
    pdfFileLink,
    secFileLink,
    createdBy,
  } = req.body;

  try {
    let toUpdate = {
      recordName: recordName,
      status: status,
      draftingInput: JSON.stringify(draftingInput),
      pdfFileLink: pdfFileLink,
      secFileLink: secFileLink,
      createdBy: createdBy,
    };

    const data = await db("records")
      .where("recordId", recordId)
      .update(toUpdate);

    console.log(data);
    if (data) {
      res.status(200).send(toUpdate);
    }
  } catch (e) {
    console.log(e);
    res.json({ response: "ERROR!" });
  }
};
const deleteRecord = async (req, res) => {
  const recordId = req.params.id;

  try {
    const data = await db("records")
      .where("recordId", recordId)
      .del(["recordId"], { includeTriggerModifications: true });
    if (data.length < 0) {
      res.json({ response: "WARNING", detail: "Record doesn't exist" });
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

export {
  getAllRecords,
  getAllCompanyRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};
