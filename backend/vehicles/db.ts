import { SQLDatabase } from "encore.dev/storage/sqldb";

export const vehiclesDB = new SQLDatabase("vehicles", {
  migrations: "./migrations",
});
