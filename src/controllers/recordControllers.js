import moment from "moment/moment.js";
import db from "../database/db.js";
import axios from "axios";

const getAllRecords = async (req, res) => {
  let { status = "" } = req.query;

  try {
    let data = await db("records")
      .select("records.*", "companies.companyName")
      .join("companies", "records.companyId", "companies.companyId")
      .whereILike("records.status", `%${status}%`)
      .orderBy([
        { column: "recordName", order: "desc" }, // Order by the first column in ascending order
        { column: "updated_at", order: "desc" }, // Order by the second column in descending order
      ]);

    const newData = await Promise.all(
      data.map(async (record) => {
        record.timestamps = await db("gis_timestamps")
          .select("*")
          .where("recordId", record.recordId)
          .orderBy([
            { column: "datetime", order: "desc" }, // Order by the second column in descending order
          ]);

        return record;
      })
    );

    const newDataWithTimestamp = newData.filter((new_data) => {
      if (new_data.timestamps.length != 0) {
        if (new_data.timestamps[0].status == "Pending for Approval") {
          return true;
        }
      } else {
        return true;
      }

      return false;
    });

    res.status(200).json(newDataWithTimestamp);
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
      .orderBy([
        { column: "recordName", order: "desc" }, // Order by the first column in ascending order
        { column: "updated_at", order: "desc" }, // Order by the second column in descending order
      ]);

    if (data.length >= 0) {
      const newData = await Promise.all(
        data.map(async (record) => {
          record.timestamps = await db("gis_timestamps")
            .select("*")
            .where("recordId", record.recordId)
            .orderBy([
              { column: "datetime", order: "desc" }, // Order by the second column in descending order
            ]);

          return record;
        })
      );

      res.status(200).json(newData);
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
      .where("status", "Completed")
      .orderBy([
        { column: "recordName", order: "desc" }, // Order by the first column in ascending order
        { column: "date_filed", order: "desc" }, // Order by the second column in descending order
      ])
      .limit(1);

    if (data.length > 0) {
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
    modified_by,
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
        let date_created = moment(
          draftingInput.actual_date_of_annual_meeting
        ).format("MMDDYYYY");
        let isAnnual = draftingInput.isSpecialMeeting ? "Amendment" : "";
        newRecordName = `${draftingInput.corporate_name} GIS ${draftingInput.year} ${isAnnual} ${date_created}`;

        if (draftingInput.corporate_name === "" || draftingInput.year === "") {
          newRecordName = `${
            company.companyName
          } GIS ${new Date().getFullYear()} ${isAnnual} ${date_created}`;
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
        modified_by,
      };

      if (recordId != "") {
        //Update if the record is existing.

        let record = await db("records").where("recordId", recordId).first();

        if (record) {
          //update query to add record object in db
          let update = await db("records")
            .where("recordId", recordId)
            .update({ ...record_object, updated_at: new Date().toISOString() });

          //checks if the data or the query was updated
          if (update) {
            const timestamp_object = {
              recordId: recordId,
              status: record_object.status,
              remarks: "",
              modified_by: record_object.modified_by,
              datetime: new Date(),
            };

            //insert timestamp
            let insertTimestamp = await db("gis_timestamps").insert(
              timestamp_object
            );

            if (insertTimestamp) {
              res.status(200).json(record_object);
            }
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
        let insert = await db("records")
          .insert(record_object)
          .returning("recordId");
        //checks if the data or the query was inserted
        if (insert) {
          const timestamp_object = {
            recordId: insert[0].recordId,
            status: record_object.status,
            remarks: "",
            modified_by: record_object.modified_by,
            datetime: new Date(),
          };

          //insert timestamp
          let insertTimestamp = await db("gis_timestamps").insert(
            timestamp_object
          );

          if (insertTimestamp) {
            res.status(200).json(record_object);
          }
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
      record.timestamps = await db("gis_timestamps")
        .select("*")
        .where("recordId", record.recordId)
        .orderBy([
          { column: "datetime", order: "desc" }, // Order by the second column in descending order
        ]);

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
    modified_by,
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
      modified_by,
      updated_at: new Date().toISOString(),
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
        "modified_by",
        "updated_at",
      ]);

    if (data.length > 0) {
      if (status == "" || status == null || status == undefined) {
        res.status(200).send(toUpdate);
      } else {
        const timestamp_object = {
          recordId: data[0].recordId,
          status: toUpdate.status,
          remarks: toUpdate.comments,
          modified_by: toUpdate.modified_by,
          datetime: new Date(),
        };

        //insert timestamp
        let insertTimestamp = await db("gis_timestamps").insert(
          timestamp_object
        );

        if (insertTimestamp) {
          res.status(200).send(toUpdate);
        }
      }
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
    const timestamps = await db("gis_timestamps")
      .select("*")
      .where("recordId", recordId);

    if (timestamps.length > 0) {
      await db("gis_timestamps").where("recordId", recordId).delete();
    }

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
      .where("status", "Completed")
      .orderBy([
        { column: "recordName", order: "desc" }, // Order by the first column in ascending order
        { column: "date_filed", order: "desc" }, // Order by the second column in descending order
      ])
      .limit(1);
    // .orderBy("date_filed", "desc")
    // .limit(1);

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

const generateGIS = async (req, res) => {
  const recordId = req.params.recordId;
  const record = { ...req.body };

  //Update Existing GIS
  if (record.attachments.google_sheets != "") {
    let toUpdate = {
      draftingInput: JSON.stringify(record.draftingInput),
    };
    try {
      await db("records").where("recordId", recordId).update(toUpdate);
    } catch (error) {
      res.status(500).json("Failed to update the record.");
      return;
    }
  }

  let url =
    "https://script.google.com/a/macros/fullsuite.ph/s/AKfycbwqWncGPkcHl8kFalRxK2syj8zH-MSKB5RrFCiIdwW1R67qqtbmU9l5MGfAV5sc8Y27ZQ/exec";

  try {
    let response = await axios.get(url, {
      params: {
        recordId: req.query.recordId,
      },
    });

    if (response.status === 200) {
      res.send(response.data);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

const updateGIS = async (req, res) => {
  const recordId = req.params.recordId;
  const { google_sheets } = req.body;

  let attachments = {
    google_sheets: google_sheets,
  };

  try {
    const update = await db("records")
      .where("recordId", recordId)
      .update({ attachments });

    if (update) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    res.sendStatus(500);
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
  generateGIS,
  updateGIS,
};
