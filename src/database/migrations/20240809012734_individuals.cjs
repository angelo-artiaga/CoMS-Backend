/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("individuals", function (table) {
      table.uuid("individuals_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("companyId").references("companyId").inTable("companies");
      table.string("surname").nullable();
      table.string("given_name").nullable();
      table.string("middle_name").nullable();
      table.string("ext_name").nullable();
      table.string("address").nullable();
      table.string("nationality").nullable();
      table.string("date_of_birth").nullable();
      table.string("tax_identification_no").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Individuals created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
