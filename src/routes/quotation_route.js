import express from "express";
import {
  addQuote,
  deleteQuote,
  generateQuote,
  getAllQuotes,
  getQuote,
  updateQuote,
} from "../controllers/quotes_controller.js";

const router = express.Router();

const url = "/quotes";

router.route(`${url}`).get(getAllQuotes).post(addQuote);

router
  .route(`${url}/:quote_id`)
  .get(getQuote)
  .patch(updateQuote)
  .delete(deleteQuote);

router.route(`/quote-generate`).get(generateQuote);

export default router;
