/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("taskRemarks", function (table) {
      table.uuid("taskRemarkId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("taskId").references("taskId").inTable("tasks");
      table.string("taskRemarkMessage").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Task Remark Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
