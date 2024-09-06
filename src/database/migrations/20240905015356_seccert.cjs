/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("seccert", function (table) {
      table.uuid("seccert_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("gdrivefolder_id").nullable();
      table.string("type").nullable();
      table.json("details").nullable();
      table.string("status").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Secretary Certificate Table Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
