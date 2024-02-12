/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("documents", (table) => {
    table.uuid("document_id").defaultTo(knex.fn.uuid()).primary();
    table.uuid("company_id").references("company_id").inTable("company");
    table.string("document_name").notNullable();
    table.string("status").notNullable();
    table.string("file_link").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("documents");
};
