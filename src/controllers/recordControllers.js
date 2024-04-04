import db from "../database/db.js";

const getAllRecords = async (req, res) => {
  try {
    const data = await db("records").select("*");
    res.status(200).json(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const createRecord = async (req, res) => {
  const {
    recordName,
    status,
    draftingInput,
    pdfInput,
    pdfFileLink,
    secFileLink,
    createdBy,
  } = req.body;

  try {
    let toInsert = {
      recordName: recordName,
      status: status,
      draftingInput: JSON.stringify(draftingInput),
      pdfInput: JSON.stringify(pdfInput),
      pdfFileLink: pdfFileLink,
      secFileLink: secFileLink,
      createdBy: createdBy,
    };

    const data = await db("records").insert(toInsert);

    if (data) {
      res.status(200).send(toInsert);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const getRecord = async (req, res) => {
  const recordId = req.params.id;
  try {
    const data = await db("records").select("*").where("recordId", recordId);
    res.send(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const updateRecord = async (req, res) => {
  const recordId = req.params.id;
  const {
    recordName,
    status,
    draftingInput,
    pdfInput,
    pdfFileLink,
    secFileLink,
    createdBy,
  } = req.body;

  try {
    let toUpdate = {
      recordName: recordName,
      status: status,
      draftingInput: JSON.stringify(draftingInput),
      pdfInput: JSON.stringify(pdfInput),
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

export { getAllRecords, getRecord, createRecord, updateRecord, deleteRecord };
