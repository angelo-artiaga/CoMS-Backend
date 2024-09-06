import { uploadImage } from "../utils/cloudinary.js";
import db from "../database/db.js";

// ### Notice of Meeting Controllers
//#region
const getNoticeOfMeeting = async (req, res) => {
  let status = 500;
  let data = {};
  try {
    let noticeOfMeeting = await db("noticeOfMeeting")
      .select("*")
      .where("nomId", req.params.nomId);
    if (noticeOfMeeting.length > 0) {
      status = 200;
      data.success = true;
      data.result = noticeOfMeeting;
    }
  } catch (error) {
    status = 500;
    data.success = false;
    data.error = error;
  } finally {
    res.status(status).json(data);
  }
};

const getAllNoticeOfMeeting = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("noticeOfMeeting")
      .column(
        "nomId",
        { notice_date: "noticeDate" },
        { type_of_meeting: "typeOfMeeting" },
        { proposed_meeting_date: "proposedMeetingDate" },
        "status",
        "folder_id",
        "created_at",
        "others"
      )
      .select()
      .where("companyId", companyId)
      .orderBy("created_at", "desc");

    if (data.length >= 0) {
      const newData = await Promise.all(
        data.map(async (record, index) => {
          let files = await db("file").select("*").where("nomId", record.nomId);
          return {
            ...record,
            files: files,
          };
        })
      );
      res.status(200).json(newData);
    } else {
      res.status(404).json({ error: "No Records Found." });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

const addNoticeOfMeeting = async (req, res) => {
  const {
    files,
    notice_date,
    proposed_meeting_date,
    status,
    type_of_meeting,
    folder_id,
    others,
  } = req.body;

  const companyId = req.params.companyId;

  let toInsert = {
    companyId: companyId,
    noticeDate: notice_date,
    typeOfMeeting: type_of_meeting,
    proposedMeetingDate: proposed_meeting_date,
    status: status,
    placeOfMeeting: "",
    quorum: "",
    folder_id: folder_id,
    others: others,
  };

  try {
    const data = await db("noticeOfMeeting")
      .insert(toInsert)
      .returning([
        "nomId",
        "companyId",
        "noticeDate",
        "typeOfMeeting",
        "proposedMeetingDate",
        "status",
        "placeOfMeeting",
        "quorum",
        "folder_id",
        "others",
      ]);

    if (data.length > 0) {
      let insertedData = data[0];
      let nomId = insertedData.nomId;

      if (files.length > 0) {
        // uploadImage();

        const uploadedFiles = await Promise.all(
          files.map(async (file, index) => {
            let upload = await uploadImage(file.file, file.fileName);

            return {
              nomId: nomId,
              fileLink: upload,
              fileName: file.fileName,
            };
          })
        );

        const insertFile = await db("file")
          .insert(uploadedFiles)
          .returning(["nomId", "fileLink", "fileName"]);

        console.log(insertFile);
        res.status(200).send({ success: true, data: data, files: insertFile });
      } else {
        res.status(200).send({ success: true, data: data, files: [] });
      }
    } else {
      res.status(422).send("Failed to insert the record");
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const updateNoticeOfMeeting = async (req, res) => {
  const {
    files,
    notice_date,
    proposed_meeting_date,
    status,
    type_of_meeting,
    nomId,
    folder_id,
    others,
  } = req.body;

  try {
    const toUpdate = {
      noticeDate: notice_date,
      typeOfMeeting: type_of_meeting,
      proposedMeetingDate: proposed_meeting_date,
      status: status,
      folder_id: folder_id,
      others: others,
    };

    let update = await db("noticeOfMeeting")
      .update(toUpdate)
      .where("nomId", nomId)
      .returning([
        "nomId",
        "noticeDate",
        "typeOfMeeting",
        "proposedMeetingDate",
        "status",
        "folder_id",
        "others",
      ]);

    if (update.length >= 1) {
      let attachFiles = files.filter((file, index) => {
        if (file.file) {
          return true;
        }
        return false;
      });
      let uploadedFiles = files.filter((file, index) => {
        if (file.fileId) {
          return true;
        }
        return false;
      });

      if (attachFiles.length > 0) {
        const newUploadedFiles = await Promise.all(
          attachFiles.map(async (file, index) => {
            let upload = await uploadImage(file.file, file.fileName);

            return {
              nomId: nomId,
              fileLink: upload,
              fileName: file.fileName,
            };
          })
        );

        const insertFile = await db("file")
          .insert(newUploadedFiles)
          .returning(["nomId", "fileLink", "fileName"]);

        update[0].files = uploadedFiles.concat(insertFile);
      } else {
        update[0].files = uploadedFiles;
      }

      res.status(200).json({ success: true, data: update });
    } else {
      res.status(422).json("Failed to update the record");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

const deleteNoticeOfMeeting = async (req, res) => {
  try {
    let nom = await db("noticeOfMeeting")
      .where("nomId", req.params.nomId)
      .delete();
    let files = await db("file").where("nomId", req.params.nomId).delete();
    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};
//#endregion

// ### Minutes of meeting Controllers
//#region
const getAllMinutesOfMeeting = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("noticeOfMeeting")
      .column(
        "nomId",
        { notice_date: "noticeDate" },
        { type_of_meeting: "typeOfMeeting" },
        { proposed_meeting_date: "proposedMeetingDate" },
        { place_of_meeting: "placeOfMeeting" },
        "quorum",
        "status",
        "folder_id",
        "created_at"
      )
      .select()
      .where("companyId", companyId)
      .where("status", "Notice Completed")
      .orderBy("created_at", "desc");

    if (data.length >= 0) {
      const newData = await Promise.all(
        data.map(async (record, index) => {
          let files = await db("file").select("*").where("nomId", record.nomId);
          return {
            ...record,
            files: files,
          };
        })
      );
      res.status(200).json(newData);
    } else {
      res.status(404).json({ error: "No Records Found." });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};
const updateMinutesOfMeeting = async (req, res) => {
  const {
    files,
    notice_date,
    proposed_meeting_date,
    status,
    type_of_meeting,
    nomId,
    place_of_meeting,
    quorum,
    folder_id,
  } = req.body;

  try {
    const toUpdate = {
      noticeDate: notice_date,
      typeOfMeeting: type_of_meeting,
      proposedMeetingDate: proposed_meeting_date,
      status: status,
      quorum: quorum,
      placeOfMeeting: place_of_meeting,
      folder_id: folder_id,
    };
    let update = await db("noticeOfMeeting")
      .update(toUpdate)
      .where("nomId", nomId)
      .returning([
        "nomId",
        "noticeDate",
        "typeOfMeeting",
        "proposedMeetingDate",
        "status",
        "quorum",
        "placeOfMeeting",
        "folder_id",
      ]);

    if (update.length >= 1) {
      update[0].files = files;
      res.status(200).json({ success: true, data: update });
    } else {
      res.status(422).json("Failed to update the record");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};
//#endregion

// ### Board Resolutions Controllers
//#region
const fetchAvailableBMDates = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("noticeOfMeeting")
      .column(
        "nomId",
        { notice_date: "noticeDate" },
        { type_of_meeting: "typeOfMeeting" },
        { proposed_meeting_date: "proposedMeetingDate" },
        "status"
      )
      .select()
      .where("status", "Notice Completed")
      .where("companyId", companyId);

    if (data.length >= 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No Records Found." });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

const getAllBoardResolution = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("boardResolution")
      .column(
        "brId",
        { type_of_meeting: "type" },
        { resolution_id: "boardResolutionId" },
        { board_meeting_date: "boardMeetingDate" },
        "description",
        "created_at"
      )
      .select()
      .where("companyId", companyId)
      .orderBy("created_at", "desc");

    if (data.length >= 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No Records Found." });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

const addBoardResolution = async (req, res) => {
  const { type_of_meeting, board_meeting_date, resolution_id, description } =
    req.body;

  const companyId = req.params.companyId;

  let toInsert = {
    companyId: companyId,
    type: type_of_meeting,
    boardMeetingDate: board_meeting_date,
    boardResolutionId: resolution_id,
    description: description,
  };

  try {
    const data = await db("boardResolution")
      .insert(toInsert)
      .returning([
        "brId",
        "companyId",
        "type",
        "boardResolutionId",
        "boardMeetingDate",
        "description",
        "createdBy",
      ]);

    if (data.length > 0) {
      res.status(200).send({ success: true, data: data });
    } else {
      res
        .status(422)
        .send({ success: false, error: "Failed to insert the record" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};

const updateBoardResolution = async (req, res) => {
  const {
    type_of_meeting,
    resolution_id,
    board_meeting_date,
    description,
    brId,
  } = req.body;

  try {
    const toUpdate = {
      type: type_of_meeting,
      boardResolutionId: resolution_id,
      boardMeetingDate: board_meeting_date,
      description: description,
    };

    let update = await db("boardResolution")
      .update(toUpdate)
      .where("brId", brId)
      .returning([
        "brId",
        "type",
        "boardResolutionId",
        "boardMeetingDate",
        "description",
      ]);

    if (update.length >= 1) {
      res.status(200).json({ success: true, data: update });
    } else {
      res.status(422).json("Failed to update the record");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

const deleteBoardResolution = async (req, res) => {
  try {
    let boardResolution = await db("boardResolution")
      .where("brId", req.params.brId)
      .delete();
    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};
//#endregion

// ### Secretary Certificate Controllers
//#region
const getSecretaryCertificate = async (req, res) => {
  let status = 500;
  let data = {};
  try {
    let secretaryCertificate = await db("seccert")
      .select("*")
      .where("seccert_id", req.params.seccert_id);
    if (secretaryCertificate.length > 0) {
      status = 200;
      data.success = true;
      data.result = secretaryCertificate;
    }
  } catch (error) {
    status = 500;
    data.success = false;
    data.error = error;
  } finally {
    res.status(status).json(data);
  }
};

const getAllSecretaryCertificate = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("seccert")
      .select("*")
      .where("companyId", companyId)
      .orderBy("created_at", "desc");

    if (data.length >= 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "No Records Found." });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

const addSecretaryCertificate = async (req, res) => {
  // const { gdrivefolder_id, type, details, status } = req.body;
  const companyId = req.params.companyId;

  try {
    const data = await db("seccert")
      .insert({ ...req.body, companyId })
      .returning(["seccert_id"]);

    if (data.length > 0) {
      res.status(200).send({ success: true, data: data });
    } else {
      res.status(422).send("Failed to insert the record");
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const updateSecretaryCertificate = async (req, res) => {
  try {
    let update = await db("seccert")
      .update(req.body)
      .where("seccert_id", req.body.seccert_id);

    if (update >= 1) {
      res.status(200).json({ success: true, data: update });
    } else {
      res.status(422).json("Failed to update the record");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

const deleteSecretaryCertificate = async (req, res) => {
  try {
    let nom = await db("seccert")
      .where("seccert_id", req.params.seccert_id)
      .delete();
    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};
//#endregion

export {
  getNoticeOfMeeting,
  getAllNoticeOfMeeting,
  addNoticeOfMeeting,
  updateNoticeOfMeeting,
  deleteNoticeOfMeeting,
  getAllMinutesOfMeeting,
  updateMinutesOfMeeting,
  fetchAvailableBMDates,
  addBoardResolution,
  getAllBoardResolution,
  updateBoardResolution,
  deleteBoardResolution,
  getSecretaryCertificate,
  getAllSecretaryCertificate,
  addSecretaryCertificate,
  updateSecretaryCertificate,
  deleteSecretaryCertificate,
};
