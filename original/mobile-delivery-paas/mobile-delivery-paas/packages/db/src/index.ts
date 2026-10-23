import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
export * from './schema.js';
const client=postgres(process.env.DATABASE_URL ?? 'postgres://mobile:mobile@localhost:5432/mobile');
export const db=drizzle(client);
