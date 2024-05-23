import knex from "knex";
import knexFile from "./knexfile.cjs";

const environment = process.env.ENVIRONMENT || "development";

export default knex(knexFile[environment]);
