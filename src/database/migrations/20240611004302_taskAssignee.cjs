/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("taskAssignee", function (table) {
      table.uuid("taskAssigneeId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("taskId").references("taskId").inTable("task");
      table.string("AssigneeName").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Assignee Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
