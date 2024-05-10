/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("file", function (table) {
      table.uuid("fileId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("nomId").references("nomId").inTable("noticeOfMeeting");
      table.string("fileName").nullable();
      table.string("fileLink").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("file Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
