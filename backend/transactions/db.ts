import { SQLDatabase } from "encore.dev/storage/sqldb";

export const transactionsDB = new SQLDatabase("transactions", {
  migrations: "./migrations",
});
