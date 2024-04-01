// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "postgresql",
    // connection: {
    //   database: process.env.DB_NAME,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    // },
    connection: process.env.DB_CONN_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
    },
  },

  production: {
    client: "postgresql",
    // connection: {
    //   database: process.env.DB_NAME,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    // },
    connection: process.env.DB_CONN_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
