exports.up = function (knex) {
  return knex.schema.table("records", (table) => {
    table.string("date_filed").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("records", (table) => {
    table.dropColumn("date_filed");
  });
};
