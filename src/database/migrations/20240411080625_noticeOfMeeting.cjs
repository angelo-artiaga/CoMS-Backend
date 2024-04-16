/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("noticeOfMeeting", function (table) {
      table.uuid("nomId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("noticeDate").nullable();
      table.string("typeOfMeeting").nullable();
      table.string("proposeMeetingDate").nullable();
      table.string("status").nullable();
      table.string("createdBy").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Notice of Meeting Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
