import knex from "knex";
import knexFile from "./knexfile.cjs";

const environment = process.env.NODE_ENV || "development";

export default knex(knexFile[environment]);
