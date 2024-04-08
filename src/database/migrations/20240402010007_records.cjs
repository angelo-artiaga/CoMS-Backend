/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("records", function (table) {
      table.uuid("recordId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("recordName").nullable();
      table.string("status").nullable();
      table.json("draftingInput").nullable();
      table.json("pdfInput").nullable();
      table.string("pdfFileLink").nullable();
      table.string("secFileLink").nullable();
      table.string("createdBy").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Record Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
