/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table("companies", function (table) {
      table.text("gdrivefolders").nullable();
    })
    .then(() => {
      console.log("Company table updated");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("companies", (table) => {
    table.dropColumn("gdrivefolders");
  });
};
