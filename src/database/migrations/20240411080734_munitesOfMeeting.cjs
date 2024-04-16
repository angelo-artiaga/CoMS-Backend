/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("munitesOfMeeting", function (table) {
      table.uuid("momId").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("boardMeetingDate").nullable();
      table.string("typeOfMeeting").nullable();
      table.string("placeOfMeeting").nullable();
      table.string("quorum").nullable();
      table.string("createdBy").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Munites of Meeting Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
