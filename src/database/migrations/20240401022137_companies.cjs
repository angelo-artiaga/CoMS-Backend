/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("companies", function (table) {
      table.uuid("companyId").defaultTo(knex.fn.uuid()).primary();
      table.string("companyName").notNullable();
      table.string("corporateTin").notNullable();
      table.string("dateRegistered").notNullable();
      table.string("logo").nullable();
      table.string("secNumber").nullable();
      table.boolean("status").notNullable().defaultTo(true);
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Company Created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("companies");
};
