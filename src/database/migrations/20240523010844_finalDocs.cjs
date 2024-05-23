/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("finalDocs", function (table) {
      table.uuid("fileId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("fileName").nullable();
      table.string("fileType").nullable();
      table.string("fileLink").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Final Documents Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
