import { SQLDatabase } from "encore.dev/storage/sqldb";

export const sparePartsDB = new SQLDatabase("spare_parts", {
  migrations: "./migrations",
});
