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
      table.date("date_of_birth").notNullable();
      table.string("account_type").notNullable();
      table.string("oauth_provider").notNullable();
      table.string("oauth_id").notNullable();
      table.string("oauth_access_token").notNullable();
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
