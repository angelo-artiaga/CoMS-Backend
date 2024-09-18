/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table("records", (table) => {
      table.text("comments").nullable();
    })
    .then(() => {
      console.log("addcolumngis: comments column created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("records", (table) => {
      table.dropColumn("comments");
    })
    .then(() => {
      console.log("addcolumngis: comments column dropped");
    });
};
