/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("tasks", function (table) {
    table.dropColumn("priorityLevel"); // Remove priorityLevel column
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("tasks", function (table) {
    table.string("priorityLevel").nullable(); // Add back priorityLevel column
  });
};
