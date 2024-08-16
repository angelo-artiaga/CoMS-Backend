/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("workFlow", function (table) {
      table.uuid("workFlowId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("agreementName").nullable();
      table.string("googleFileLink").nullable();
      table.string("workFlowName").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Work Flow Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
