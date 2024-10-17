/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("mc28forms", function (table) {
      table.uuid("form_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("company_id").references("companyId").inTable("companies");
      table.string("form_name").nullable();
      table.string("status").nullable();
      table.json("form_data").nullable();
      table.string("folder_id").nullable();
      table.string("created_by").nullable();
      table.string("modified_by").nullable();
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
