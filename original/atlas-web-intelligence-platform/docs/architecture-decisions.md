# Architecture Decisions

1. **PostgreSQL + Drizzle:** relational tenant boundaries, typed schema, SQL migrations, no proprietary ORM dependency.
2. **Express:** small, familiar REST layer; async handlers and Zod validation.
3. **React/Vite:** developer console with project, key, usage and playground flows.
4. **API key hashes:** persist digest rather than plaintext; one-time secret reveal.
5. **Brave Search provider:** real web results without pretending to operate an independent search index. Provider abstraction is follow-up work.
6. **Synchronous crawl MVP:** simple for evaluation; queue-based workers required for production.
7. **SDK in same npm workspace:** shared versioning and integration ergonomics.
