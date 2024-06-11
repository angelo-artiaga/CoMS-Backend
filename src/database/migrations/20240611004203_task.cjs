/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("task", function (table) {
      table.uuid("taskId").defaultTo(knex.fn.uuid()).primary();
      table
        .uuid("serviceAgreementId")
        .references("serviceAgreementId")
        .inTable("serviceAgreement");
      table.string("task").nullable();
      table.string("targetDate").nullable();
      table.string("status").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Task Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
