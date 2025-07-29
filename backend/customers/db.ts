import { SQLDatabase } from "encore.dev/storage/sqldb";

export const customersDB = new SQLDatabase("customers", {
  migrations: "./migrations",
});
