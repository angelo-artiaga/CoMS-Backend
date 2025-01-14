/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table("quotes", (table) => {
      table.json("attachments").nullable();
    })
    .then(() => {
      console.log("add_column_quotes: attachments column created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
