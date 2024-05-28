import { uploadImage } from "../utils/cloudinary.js";
import db from "../database/db.js";

const getNoticeOfMeeting = async (req, res) => {};

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
        "created_at"
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
  } = req.body;

  try {
    const toUpdate = {
      noticeDate: notice_date,
      typeOfMeeting: type_of_meeting,
      proposedMeetingDate: proposed_meeting_date,
      status: status,
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

      console.log(update);

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

//Minutes of meeting

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
  } = req.body;

  try {
    const toUpdate = {
      noticeDate: notice_date,
      typeOfMeeting: type_of_meeting,
      proposedMeetingDate: proposed_meeting_date,
      status: status,
      quorum: quorum,
      placeOfMeeting: place_of_meeting,
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

//Board Resolutions

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
};
