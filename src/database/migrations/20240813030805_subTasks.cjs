/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("subTasks", function (table) {
      table.uuid("subTaskId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("taskId").references("taskId").inTable("tasks");
      table.string("subTaskName").nullable();
      table.boolean("subTaskStatus").defaultTo(false);
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Task Subtask Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
