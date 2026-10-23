# TypeScript SDK Specification

Package: `@atlas/sdk`. Construct with `{apiKey,baseUrl?,timeoutMs?}`. Methods:
- `search({query,limit?},signal?)` returns `{results:[{title,url,snippet}]}`.
- `extract({urls},signal?)` returns `{results:[{url,title,content}]}`.
- `map({url,limit?},signal?)` returns `{url,links}`.
- `crawl({url,limit?,depth?},signal?)` returns `{url,pages,discovered}`.

Uses standard Fetch API; throws on non-2xx; aborts after default 30 seconds; supports caller AbortSignal. Does not retry unsafe operations automatically. Keep API keys in server-side secrets; rotate by creating replacement, deploying, verifying and revoking old key. Package build: `npm run build -w @atlas/sdk`.
