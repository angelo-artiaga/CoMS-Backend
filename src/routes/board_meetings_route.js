import express from "express";
import {
  addBoardResolution,
  addNoticeOfMeeting,
  addSecretaryCertificate,
  deleteBoardResolution,
  deleteNoticeOfMeeting,
  deleteSecretaryCertificate,
  fetchAvailableBMDates,
  getAllBoardResolution,
  getAllMinutesOfMeeting,
  getAllNoticeOfMeeting,
  getAllSecretaryCertificate,
  getNoticeOfMeeting,
  getSecretaryCertificate,
  updateBoardResolution,
  updateMinutesOfMeeting,
  updateNoticeOfMeeting,
  updateSecretaryCertificate,
} from "../controllers/board_meeting_controller.js";
const router = express.Router();

const noticeOfmeetingURL = "/notice-of-meeting";
const minutesOfmeetingURL = "/minutes-of-meeting";
const boardResolutionsURL = "/board-resolutions";
const secretaryCertificateURL = "/secretary-certificate";

//Notice of Meeting Routes
router.get(`${noticeOfmeetingURL}/:companyId/`, getAllNoticeOfMeeting);
router.get(`${noticeOfmeetingURL}/:companyId/:nomId`, getNoticeOfMeeting);
router.post(`${noticeOfmeetingURL}/:companyId/`, addNoticeOfMeeting);
router.patch(`${noticeOfmeetingURL}/:companyId/`, updateNoticeOfMeeting);
router.delete(`${noticeOfmeetingURL}/:companyId/:nomId`, deleteNoticeOfMeeting);

//Minutes of Meeting Routes
router.get(`${minutesOfmeetingURL}/:companyId/`, getAllMinutesOfMeeting);
router.patch(`${minutesOfmeetingURL}/:companyId/`, updateMinutesOfMeeting);

//Board Resolution Routes
router.get(`${boardResolutionsURL}/:companyId/bmdates`, fetchAvailableBMDates);
router.get(`${boardResolutionsURL}/:companyId`, getAllBoardResolution);
router.post(`${boardResolutionsURL}/:companyId/`, addBoardResolution);
router.patch(`${boardResolutionsURL}/:companyId/`, updateBoardResolution);
router.delete(`${boardResolutionsURL}/:companyId/:brId`, deleteBoardResolution);

//Secretary Certificate Routes
router.get(
  `${secretaryCertificateURL}/:companyId/`,
  getAllSecretaryCertificate
);
router.get(
  `${secretaryCertificateURL}/:companyId/:seccert_id`,
  getSecretaryCertificate
);
router.post(`${secretaryCertificateURL}/:companyId/`, addSecretaryCertificate);
router.patch(
  `${secretaryCertificateURL}/:companyId/`,
  updateSecretaryCertificate
);
router.delete(
  `${secretaryCertificateURL}/:companyId/:seccert_id`,
  deleteSecretaryCertificate
);

// router.get("/gis/list", viewAllGis);
// router.patch("/gis/update/:id", updateGis);
// router.post("/gis-upload", uploadGis);
// router.delete("/gis/delete", deleteGis);

export default router;
