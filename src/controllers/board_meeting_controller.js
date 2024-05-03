import { uploadImage } from "../utils/cloudinary.js";

const getNoticeOfMeeting = async (req, res) => {};

const getAllNoticeOfMeeting = async (req, res) => {};

const addNoticeOfMeeting = async (req, res) => {
  const {file, fileName} = req.body;


  try {
    // uploadImage();
    let upload = await uploadImage(file, fileName);

    res.status(200).json(upload);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const updateNoticeOfMeeting = (req, res) => {};

const deleteNoticeOfMeeting = (req, res) => {};

export {
  getNoticeOfMeeting,
  getAllNoticeOfMeeting,
  addNoticeOfMeeting,
  updateNoticeOfMeeting,
  deleteNoticeOfMeeting,
};
