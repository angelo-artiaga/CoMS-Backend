/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table("companies", function (table) {
      table.string("sss").notNullable();
      table.string("hdmf").nullable();
      table.string("philHealth").nullable();
    })
    .then(() => {
      console.log("Company table updated");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
