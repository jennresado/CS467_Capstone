require("dotenv").config();
const pgConnection =
  process.env.DATABASE_URL ||
  "postgres://uqmjbxwycxyzbs:3200598d42394f29b1050337fdcfb8dab14a1ee3b4a8699f92bbab39e7794fa1@ec2-23-23-164-251.compute-1.amazonaws.com:5432/d85rr955rte9ro";

module.exports = {
  development: {
    client: "pg",
    connection: {
      port: process.env.DATABASE_PORT || 5432,
      host: process.env.DATABASE_HOST || "localhost",
      database: process.env.DATABASE_NAME || "animal_app",
      user: process.env.DATABASE_USER || "postgres",
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
      host: process.env.DATABASE_HOST || "localhost",
      database: process.env.DATABASE_NAME_TEST || "animal_app_test",
      user: process.env.DATABASE_USER || "postgres",
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
    client: "pg",
    connection: {
      connectionString: pgConnection,
      ssl: { rejectUnauthorized: false },
    },
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
    useNullAsDefault: true,
  },
};
