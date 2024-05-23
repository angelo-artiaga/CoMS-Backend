/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.uuid("user_id").defaultTo(knex.fn.uuid()).primary();
      table.string("email").notNullable().unique();
      table.string("first_name").notNullable();
      table.string("middle_name").nullable();
      table.string("last_name").notNullable();
      table.string("last_login").notNullable();
      table.string("token").notNullable().unique();
      table.string("refresh_token").notNullable().unique();
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
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
