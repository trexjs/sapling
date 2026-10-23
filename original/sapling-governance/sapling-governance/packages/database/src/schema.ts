import { pgSchema, uuid, varchar, jsonb, timestamp, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
const consent=pgSchema('consent');
const compliance=pgSchema('compliance');
const common=(schema:typeof consent | typeof compliance)=>schema.table('records',{
 id:uuid('id').defaultRandom().primaryKey(),tenantId:varchar('tenant_id',{length:128}).notNull(),module:varchar('module',{length:64}).notNull(),name:varchar('name',{length:240}).notNull(),status:varchar('status',{length:50}).notNull().default('draft'),data:jsonb('data').$type<Record<string,unknown>>().notNull().default({}),createdAt:timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),updatedAt:timestamp('updated_at',{withTimezone:true}).defaultNow().notNull()
},t=>[index('records_tenant_module_idx').on(t.tenantId,t.module)]);
export const consentRecords=common(consent);
export const complianceRecords=common(compliance);
export const decisions=consent.table('decisions',{
 id:uuid('id').defaultRandom().primaryKey(),tenantId:varchar('tenant_id',{length:128}).notNull(),subjectId:varchar('subject_id',{length:256}).notNull(),domainId:varchar('domain_id',{length:256}).notNull(),policyVersion:varchar('policy_version',{length:80}).notNull(),categories:jsonb('categories').$type<Record<string,boolean>>().notNull(),region:varchar('region',{length:80}).notNull(),source:varchar('source',{length:80}).notNull(),createdAt:timestamp('created_at',{withTimezone:true}).defaultNow().notNull()
},t=>[index('decisions_lookup_idx').on(t.tenantId,t.subjectId,t.domainId,t.createdAt)]);
export const jobs=compliance.table('monitor_runs',{
 id:uuid('id').defaultRandom().primaryKey(),tenantId:varchar('tenant_id',{length:128}).notNull(),controlId:uuid('control_id').notNull(),passed:boolean('passed').notNull(),details:jsonb('details').$type<Record<string,unknown>>().default({}).notNull(),createdAt:timestamp('created_at',{withTimezone:true}).defaultNow().notNull()
});
