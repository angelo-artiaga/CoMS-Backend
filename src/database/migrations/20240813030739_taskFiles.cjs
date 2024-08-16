/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("taskFiles", function (table) {
      table.uuid("taskFilesId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("taskId").references("taskId").inTable("tasks");
      table.string("taskFileName").nullable();
      table.string("taskGoogleFileLink").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Task File Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
