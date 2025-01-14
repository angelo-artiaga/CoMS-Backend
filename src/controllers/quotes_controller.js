import axios from "axios";
import db from "../database/db.js";
import moment from "moment";

//#region CONSTANTS

const TABLE_NAME = "quotes";

const QuoteState = {
  type: "Business Permit Renewal Quotation",
};

const QuoteAttachmentsState = {
  signed_document_url: "",
  invoice_url: "",
  proof_of_payment_url: "",
};

//#endregion

//#region CLASS
class Quote {
  constructor({
    quote_id = "",
    quote_number = "",
    quote_name = "",
    form_data = QuoteState,
    folder_id = "",
    google_doc_id = "",
    attachments = QuoteAttachmentsState,
    created_at = "",
    updated_at = "",
  } = {}) {
    this.quote_id = quote_id;
    this.quote_number = quote_number;
    this.quote_name = quote_name;
    this.form_data = form_data;
    this.folder_id = folder_id;
    this.google_doc_id = google_doc_id;
    this.attachments = attachments;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  static async fetchAll() {
    let quotes = await db(TABLE_NAME).select("*");

    let appendTimestamps = await Promise.all(
      quotes.map(async (quote) => {
        let timestamps = await db("quotes_timestamps")
          .select("*")
          .where("quote_id", quote.quote_id)
          .orderBy([
            { column: "datetime", order: "desc" }, // Order by the second column in descending order
          ]);

        quote.timestamps = timestamps;

        return quote;
      })
    );

    return appendTimestamps;
  }

  // Fetch a record by ID
  static async fetch(quote_id) {
    try {
      let quote = await db(TABLE_NAME).select("*").where({ quote_id }).first();

      if (quote) {
        let timestamps = await db("quotes_timestamps")
          .select("*")
          .where("quote_id", quote.quote_id)
          .orderBy([
            { column: "datetime", order: "desc" }, // Order by the second column in descending order
          ]);

        quote.timestamps = timestamps;
        return quote;
      }
    } catch (error) {
      return null;
    }
  }

  // Add a new record
  async add(modified_by) {
    // Exclude the `quote_id`, `created_at`,`updated_at` from the insert data
    const { quote_id, created_at, updated_at, ...dataToInsert } = this;

    const insert = await db(TABLE_NAME)
      .insert(dataToInsert)
      .returning(Object.keys(this));

    if (insert) {
      const timestamp_object = {
        quote_id: insert[0].quote_id,
        status: "Drafted",
        remarks: "",
        modified_by,
        datetime: new Date(),
      };

      await db("quotes_timestamps").insert(timestamp_object);
    }

    return insert;
  }

  // Update a record
  async update(modified_by, status, remarks = "") {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = Quote.getUpdateFields(dataToUpdate);

    if (Object.keys(fieldsToUpdate).length > 0) {
      let update = await db(TABLE_NAME)
        .where({ quote_id: this.quote_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));

      if (update) {
        const timestamp_object = {
          quote_id: update[0].quote_id,
          status,
          remarks,
          modified_by,
          datetime: new Date(),
        };

        await db("quotes_timestamps").insert(timestamp_object);
      }

      return update;
    }

    return [this];
  }

  // Delete a record by ID
  static async delete(quote_id) {
    //delete timestamps of the record
    await db("quotes_timestamps").where({ quote_id }).delete();
    return await db(TABLE_NAME).where({ quote_id }).del();
  }

  // Static method to prepare fields for updates
  static getUpdateFields(instance) {
    const updates = {};
    for (const key in instance) {
      if (
        instance[key] !== undefined &&
        key !== "document_id" &&
        instance[key] !== null
      ) {
        updates[key] = instance[key] === "" ? "" : instance[key];
      }
    }
    return updates;
  }
}
//#endregion

//#region FUNCTIONS

export const getAllQuotes = async (req, res) => {
  try {
    const records = await Quote.fetchAll();
    if (records) {
      res.json(records);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// export const getDocumentDraftsPerCompany = async (req, res) => {
//   const { company_id } = req.params; // Extracting the Company ID from the request parameters

//   try {
//     const records = await Quote.fetchAllPerCompany(company_id);
//     if (records) {
//       res.json(records);
//     } else {
//       res.status(404).send("Record not found");
//     }
//   } catch (error) {
//     res.status(500).send("Server error");
//   }
// };

export const getQuote = async (req, res) => {
  const { company_id, quote_id } = req.params; // Extracting the user ID from the request parameters

  try {
    const record = await Quote.fetch(quote_id);
    if (record) {
      res.json(record);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
    // console.log(error);
  }
};

const getQuoteNumber = async (company = "Viascari, Inc.") => {
  let text = "VIA";
  let quote_number = "VIA-43606";

  const quotes = await db("quotes").select("quote_number", "form_data");

  if (company == "Offshore Concept BPO Services, Inc.") {
    text = "VGC";
    quote_number = "VGC-00000";

    if (quotes.length > 0) {
      let VGCQuotes = quotes.filter(
        (quote) =>
          quote.form_data.billing_account ==
          "Offshore Concept BPO Services, Inc."
      );

      if (VGCQuotes.length > 0) {
        VGCQuotes.sort((a, b) => {
          return b.quote_number.localeCompare(a.quote_number);
        });

        quote_number = VGCQuotes[0].quote_number;
      }
    }
  } else {
    if (quotes.length > 0) {
      let VIAQuotes = quotes.filter(
        (quote) => quote.form_data.billing_account == "Viascari, Inc."
      );

      if (VIAQuotes.length > 0) {
        VIAQuotes.sort((a, b) => {
          return b.quote_number.localeCompare(a.quote_number);
        });

        quote_number = VIAQuotes[0].quote_number;
      }
    }
  }

  let number = Number(quote_number.split("-")[1]) + 1;

  let formatNumber = number.toLocaleString("en-US", {
    minimumIntegerDigits: 5,
    useGrouping: false,
  });

  return `${text}-${formatNumber}`;
};

export const addQuote = async (req, res) => {
  const data = req.body.form;

  if (
    data.form_data.billing_account != "Offshore Concept BPO Services, Inc." &&
    data.form_data.billing_account != "Viascari, Inc."
  ) {
    res.status(400).json("Please select a valid company.");
    return;
  }

  let quote_name = `${data.form_data.service_type} ${moment().format(
    "MMDDYYYYhhmmssA"
  )}`;

  try {
    const record = new Quote({
      ...data,
      quote_name: quote_name,
      quote_number: await getQuoteNumber(data.form_data.billing_account),
    });

    let response = await record.add(req.body.modified_by);
    res.status(201).json(response[0]);
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

/*
  {
    "form": {
        "form_data": {
            "service_type": "Business Permit Renewal Quotation",
            "company": "Viascari, Inc"
        }
    },
    "modified_by": "Benjie Pecson",
    "status": "Completed"
  }
*/
export const updateQuote = async (req, res) => {
  const { company_id, quote_id } = req.params;
  const data = req.body.form;

  if (req.body.modified_by == "" || req.body.status == "") {
    res.status(400).json("Please provide necessary details.");
    return;
  }

  let attachments = QuoteAttachmentsState;

  if (
    req.body.attachments != undefined &&
    Object.keys(req.body.attachments).length != 0
  ) {
    attachments = req.body.attachments;
  }

  try {
    const existingRecord = await Quote.fetch(quote_id);

    if (existingRecord) {
      const updatedRecord = new Quote({
        ...existingRecord,
        ...data,
        attachments,
        quote_id: quote_id,
      });

      let response = await updatedRecord.update(
        req.body.modified_by,
        req.body.status,
        req.body.remarks
      );

      res.json(response[0]);
    } else {
      res.status(404).send("Record not found");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const deleteQuote = async (req, res) => {
  const { quote_id } = req.params;

  // console.log(quote_id);
  // res.send(quote_id);
  // return;

  try {
    await Quote.delete(quote_id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const generateQuote = async (req, res) => {
  if (!req.query.quote_id) {
    res.sendStatus(400);
    return;
  }

  let url =
    "https://script.google.com/a/macros/fullsuite.ph/s/AKfycbx1CDGYPQ80Ld4GzQhXmd-D85p7HWnezIGngyCzZZdvFPNDisCbg1CFrUUv0PH_EEzd/exec";

  try {
    let response = await axios.get(url, {
      params: {
        quote_id: req.query.quote_id,
      },
    });

    if (response.status === 200) {
      res.send(response.data);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

//#endregion
