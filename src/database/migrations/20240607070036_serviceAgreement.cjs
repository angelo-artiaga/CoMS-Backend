/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("serviceAgreement", function (table) {
      table.uuid("serviceAgreementId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("agreementName").nullable();
      table.string("fileLink").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Service Agreement Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
