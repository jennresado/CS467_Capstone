require('dotenv').config();
const pgConnection =
  process.env.DATABASE_URL || "postgresql://postgres@localhost/animal_app";

module.exports = {
  development: {
    client: "pg",
    connection: {
        port: process.env.DATABASE_PORT || 5432,
        host: process.env.DATABASE_HOST || 'localhost',
        database: process.env.DATABASE_NAME || 'animal_app',
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_ACCESS_KEY || undefined,
      },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
    pool: {
      min: 2,
      max: 10,
    },
    useNullAsDefault: true,
  },

  testing: {
    client: "pg",
    connection: {
        port: process.env.DATABASE_PORT || 5432,
        host: process.env.DATABASE_HOST || 'localhost', 
        database: process.env.DATABASE_NAME_TEST || 'animal_app_test',
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_ACCESS_KEY || undefined,
      },
    migrations: {
      directory: "./db/migrations",
    },
    pool: {
      min: 2,
      max: 10,
    },
    seeds: {
      directory: "./db/seeds",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
    connection: pgConnection,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
  },
};
