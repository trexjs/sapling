import { readdir, rm } from 'node:fs/promises';
for (const pkg of await readdir(new URL('../packages/', import.meta.url))) await rm(new URL(`../packages/${pkg}/dist/`, import.meta.url), { recursive: true, force: true });
