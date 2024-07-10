/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Drop foreign key constraints
  await knex.schema.table("task", function (table) {
    table.dropForeign("serviceAgreementId");
  });

  // Drop the table
  return knex.schema.dropTableIfExists("serviceAgreement");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  knex.schema.createTable("serviceAgreement", function (table) {
    table.uuid("serviceAgreementId").defaultTo(knex.fn.uuid()).primary();
    table.uuid("companyId").references("companyId").inTable("companies");
    table.string("agreementName").nullable();
    table.string("fileLink").nullable();
    table.timestamps(true, true);
  });
};
