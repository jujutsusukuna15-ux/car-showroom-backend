import { SQLDatabase } from "encore.dev/storage/sqldb";

export const repairsDB = new SQLDatabase("repairs", {
  migrations: "./migrations",
});
