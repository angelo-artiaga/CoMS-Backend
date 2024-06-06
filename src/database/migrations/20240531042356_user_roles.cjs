/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("user_roles", function (table) {
      table.uuid("user_roles_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("user_id").references("user_id").inTable("users");
      table.uuid("role_id").references("role_id").inTable("roles");
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Users created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
