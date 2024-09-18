import moment from "moment/moment.js";
import db from "../database/db.js";

const getAllRecords = async (req, res) => {
  let { status = "" } = req.query;

  try {
    const data = await db("records")
      .select("records.*", "companies.companyName")
      .join("companies", "records.companyId", "companies.companyId")
      .whereILike("records.status", `%${status}%`);
    res.status(200).json(data);
  } catch (e) {
    res.json({ response: "ERROR!", error: e });
  }
};

const getAllCompanyRecords = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("records")
      .select("*")
      .where("companyId", companyId)
      .orderBy("created_at", "desc");
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

const getCurrentDirectors = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("records")
      .select("*")
      .where("companyId", companyId)
      .orderBy("created_at", "desc")
      .limit(1);
    if (data.length == 1) {
      res.status(200).json(data[0].draftingInput.directors_or_officers);
    } else {
      res.status(200).json(data);
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
    recordName,
    status,
    draftingInput,
    createdBy,
    folder_id,
    // gdrivefolders,
    date_filed,
    comments,
  } = req.body;

  try {
    //check company if exist
    const companies = await db("companies")
      .select("*")
      .where("companyId", companyId);

    if (companies.length == 1) {
      //add to db if company ID exists

      //company details
      let company = companies[0];

      let newRecordName = recordName;

      //record name
      if (newRecordName == "") {
        newRecordName = `${draftingInput.corporate_name} ${
          draftingInput.year
        } ${moment().format("MMDDYYYY")}`;

        if (draftingInput.corporate_name === "" || draftingInput.year === "") {
          newRecordName = `${
            company.companyName
          } ${new Date().getFullYear()} ${moment().format("MMDDYYYY")}`;
        }
      }

      //Create an object
      let record_object = {
        companyId: company.companyId,
        recordName: newRecordName,
        status: status,
        draftingInput: JSON.stringify(draftingInput),
        // pdfInput: JSON.stringify(pdfInput),
        // pdfFileLink: pdfFileLink,
        // secFileLink: secFileLink,
        folder_id: folder_id,
        // gdrivefolders: JSON.stringify(gdrivefolders),
        date_filed: date_filed,
        comments: comments,
        createdBy: createdBy,
      };

      if (recordId != "") {
        //Update if the record is existing.

        let record = await db("records").where("recordId", recordId).first();

        if (record) {
          //update query to add record object in db
          let update = await db("records")
            .where("recordId", recordId)
            .update(record_object);

          //checks if the data or the query was updated
          if (update) {
            res.status(200).json(record_object);
          } else {
            res
              .status(500)
              .send({ error: `Failed to update the record in the database.` });
          }
        } else {
          res
            .status(404)
            .json({ error: `Record ID: ${recordId} is not found.` });
        }
      } else {
        //else, insert the record.
        //insert query to add record object in db
        let insert = await db("records").insert(record_object);
        //checks if the data or the query was inserted
        if (insert) {
          res.status(200).json(record_object);
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
    const record = await db("records")
      .select("records.*", "companyName")
      .join("companies", "records.companyId", "companies.companyId")
      .where("recordId", recordId)
      .first();
    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ error: "Record ID does not exists." });
    }
  } catch (e) {
    //returns 500 status code
    res.status(500).json({ error: "Internal Server Error", err_msg: e });
  }
};

const updateRecord = async (req, res) => {
  const recordId = req.params.recordId;
  const {
    recordName,
    status,
    draftingInput,
    pdfFileLink,
    secFileLink,
    createdBy,
    folder_id,
    date_filed,
    comments,
    // gdrivefolders,
  } = req.body;

  try {
    let toUpdate = {
      recordName: recordName,
      status: status,
      draftingInput: JSON.stringify(draftingInput),
      pdfFileLink: pdfFileLink,
      secFileLink: secFileLink,
      folder_id: folder_id,
      date_filed,
      comments,
      createdBy: createdBy,
      // gdrivefolders: gdrivefolders,
    };

    const data = await db("records")
      .where("recordId", recordId)
      .update(toUpdate)
      .returning([
        "recordId",
        "recordName",
        "draftingInput",
        "pdfFileLink",
        "secFileLink",
        "folder_id",
        "date_filed",
        "createdBy",
      ]);

    if (data.length > 0) {
      res.status(200).send(toUpdate);
    } else {
      res.status(422).send("Failed to update the record");
    }
  } catch (e) {
    console.log(e);
    res.json({ response: "ERROR!" });
  }
};

const deleteRecord = async (req, res) => {
  const recordId = req.params.recordId;

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

const getLatestGIS = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("records")
      .select("*")
      .where("companyId", companyId)
      .orderBy("created_at", "desc")
      .limit(1);
    if (data.length == 1) {
      res.status(200).json(data[0].draftingInput);
    } else {
      res.status(200).json(data);
    }
  } catch (e) {
    //returns 500 status code
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

export {
  getAllRecords,
  getAllCompanyRecords,
  getCurrentDirectors,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getLatestGIS,
};
