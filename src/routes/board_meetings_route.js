import express from "express";
import {addNoticeOfMeeting, getAllNoticeOfMeeting, getNoticeOfMeeting} from "../controllers/board_meeting_controller.js";
const router = express.Router();

const noticeOfmeetingURL = "/board-meetings/notice-of-meeting";

router.get(`${noticeOfmeetingURL}/:company_id/`, getAllNoticeOfMeeting);
router.get(`${noticeOfmeetingURL}/:company_id/:id`, getNoticeOfMeeting);
router.post(`${noticeOfmeetingURL}/:company_id/`, addNoticeOfMeeting);

// router.get("/gis/list", viewAllGis);
// router.patch("/gis/update/:id", updateGis);
// router.post("/gis-upload", uploadGis);
// router.delete("/gis/delete", deleteGis);

export default router;
