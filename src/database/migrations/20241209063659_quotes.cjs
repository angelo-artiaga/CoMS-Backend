/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const quotes = await knex.schema
    .createTable("quotes", function (table) {
      table.uuid("quote_id").defaultTo(knex.fn.uuid()).primary();
      table.string("quote_number").notNullable();
      table.string("quote_name").nullable().defaultTo("");
      table.json("form_data").notNullable();
      table.string("folder_id").nullable().defaultTo("");
      table.string("google_doc_id").nullable().defaultTo("");
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("quotes table created");
    });

  const quotes_timestamps = await knex.schema
    .createTable("quotes_timestamps", function (table) {
      table.uuid("quotes_timestamps_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("quote_id").references("quote_id").inTable("quotes");
      table.string("status").nullable();
      table.string("modified_by").nullable();
      table.text("remarks").nullable();
      table.timestamp("datetime").notNullable().defaultTo(knex.fn.now());
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("quotes_timestamps table created");
    });

  return quotes_timestamps;
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
