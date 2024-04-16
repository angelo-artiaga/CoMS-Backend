/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("secretaryCertificate", function (table) {
      table.uuid("scId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("type").nullable();
      table.string("secretaryCertificateId").nullable();
      table.string("boardMeetingDate").nullable();
      table.string("description").nullable();
      table.string("createdBy").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Secretary Certificate Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
