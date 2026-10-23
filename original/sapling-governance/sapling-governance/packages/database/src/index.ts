import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
export * from './schema.js';
const connection=postgres(process.env.DATABASE_URL ?? 'postgres://sapling:sapling@localhost:5432/governance');
export const db=drizzle(connection);
export async function closeDb(){await connection.end();}
