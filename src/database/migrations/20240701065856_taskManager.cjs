/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  knex.schema
    .createTable("tasks", (table) => {
      table.uuid("taskId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("taskDescription", 255);
      table.string("targetDate").nullable();
      table.string("status").nullable();
      table.string("remarks").nullable();
      table.string("serviceAgreement").nullable();
      table.string("serviceAgreementFileLink").nullable();
      table.specificType("assignee", "TEXT[]");
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Task Manager Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
