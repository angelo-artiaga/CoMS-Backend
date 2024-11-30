/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("gis_timestamps", function (table) {
      table.uuid("gis_timestamps_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("recordId").references("recordId").inTable("records");
      table.string("status").nullable();
      table.string("modified_by").nullable();
      table.text("remarks").nullable();
      table.timestamp("datetime").notNullable().defaultTo(knex.fn.now())
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("MC28Form table created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
