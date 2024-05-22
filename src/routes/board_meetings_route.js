import express from "express";
import {
  addBoardResolution,
  addNoticeOfMeeting,
  deleteBoardResolution,
  deleteNoticeOfMeeting,
  fetchAvailableBMDates,
  getAllBoardResolution,
  getAllMinutesOfMeeting,
  getAllNoticeOfMeeting,
  getNoticeOfMeeting,
  updateBoardResolution,
  updateMinutesOfMeeting,
  updateNoticeOfMeeting,
} from "../controllers/board_meeting_controller.js";
const router = express.Router();

const noticeOfmeetingURL = "/notice-of-meeting";
const minutesOfmeetingURL = "/minutes-of-meeting";
const boardResolutionsURL = "/board-resolutions";

router.get(`${noticeOfmeetingURL}/:companyId/`, getAllNoticeOfMeeting);
router.get(`${noticeOfmeetingURL}/:companyId/:nomId`, getNoticeOfMeeting);
router.post(`${noticeOfmeetingURL}/:companyId/`, addNoticeOfMeeting);
router.patch(`${noticeOfmeetingURL}/:companyId/`, updateNoticeOfMeeting);
router.delete(`${noticeOfmeetingURL}/:companyId/:nomId`, deleteNoticeOfMeeting);

router.get(`${minutesOfmeetingURL}/:companyId/`, getAllMinutesOfMeeting);
router.patch(`${minutesOfmeetingURL}/:companyId/`, updateMinutesOfMeeting);

router.get(`${boardResolutionsURL}/:companyId/bmdates`, fetchAvailableBMDates);
router.get(`${boardResolutionsURL}/:companyId`, getAllBoardResolution);
router.post(`${boardResolutionsURL}/:companyId/`, addBoardResolution);
router.patch(`${boardResolutionsURL}/:companyId/`, updateBoardResolution);
router.delete(`${boardResolutionsURL}/:companyId/:brId`, deleteBoardResolution);

// router.get("/gis/list", viewAllGis);
// router.patch("/gis/update/:id", updateGis);
// router.post("/gis-upload", uploadGis);
// router.delete("/gis/delete", deleteGis);

export default router;
