/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
"use strict";
exports.up = function (knex) {
  return knex.schema
    .createTable("company", function (table) {
      table.uuid("company_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("admin_id").references("user_id").inTable("users");
      table.string("company_name").notNullable();
      table.string("address").nullable();
      table.specificType("managed_by", "UUID[]");
      table.string("storage_link").notNullable();
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
  return knex.schema.dropTable("company");
};
