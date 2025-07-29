import { SQLDatabase } from "encore.dev/storage/sqldb";

// Use existing databases for reporting instead of creating a separate one
export const vehiclesDB = SQLDatabase.named("vehicles");
export const transactionsDB = SQLDatabase.named("transactions");
export const sparePartsDB = SQLDatabase.named("spare_parts");
export const repairsDB = SQLDatabase.named("repairs");
