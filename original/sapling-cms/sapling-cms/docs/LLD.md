# Low-level design

## Schema
`cms_users(id,email,password_hash,role)`; `cms_models(slug,name,kind,fields)`; `cms_entries(id,model,locale,status,data,version,publish_at)`; `cms_revisions(id,entry_id,version,snapshot)`; `cms_assets(id,key,filename,mime,size,metadata)`; `cms_locales(code,name)`; `cms_webhooks(id,url,secret,events)`; `cms_audit(id,actor,action,entity,payload)`.

## Create entry
1. Verify JWT and editor/admin role.
2. Load model schema by slug.
3. Parse request using Zod; reject missing/unknown/wrongly typed fields.
4. Enforce single-type uniqueness in application layer (database constraint is needed).
5. Insert draft entry; snapshot revision; write audit; send event.
6. Return created entry. **These steps are not transactional yet** and webhook delivery currently happens in request path.

## Update and publish
Update merges existing JSON data, validates, increments revision and reverts to draft. Publish changes status; public delivery filters `status=published`. Restoring a revision writes a new version and resets status to draft. Publication does not currently snapshot a new revision.

## SDK
`SaplingCMS({baseUrl,token})`: `models`, `createModel`, `entries`, `create`, `update`, `publish`, `revisions`, `restore`, `locales`, `assets`, `audit`.

## Authorization matrix
Public: delivery only. Editor: read models/content and modify entries/assets. Admin: editor rights plus model, locale, webhook, audit administration. Fine-grained RBAC/ABAC is not implemented.

## Operational risks
Schema changes are not migration-aware. Signed upload URLs are issued before object confirmation. Webhook destinations are not SSRF-restricted. JWT revocation and key rotation are absent. There is no tenancy boundary. See `IMPROVEMENTS.md`.
