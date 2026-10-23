import {pgTable,uuid,text,jsonb,timestamp,integer,index,uniqueIndex} from 'drizzle-orm/pg-core';
export const resources=pgTable('cloud_resources',{
 id:uuid('id').primaryKey().defaultRandom(),tenantId:text('tenant_id').notNull(),projectId:text('project_id').notNull(),
 capability:text('capability').notNull(),kind:text('kind').notNull(),name:text('name').notNull(),
 spec:jsonb('spec').$type<Record<string,unknown>>().notNull(),status:text('status').notNull().default('requested'),
 generation:integer('generation').notNull().default(1),createdAt:timestamp('created_at',{withTimezone:true}).defaultNow().notNull(),
 updatedAt:timestamp('updated_at',{withTimezone:true}).defaultNow().notNull()
},t=>[index('resources_scope_idx').on(t.tenantId,t.projectId,t.capability),uniqueIndex('resources_name_idx').on(t.tenantId,t.projectId,t.capability,t.kind,t.name)]);
export const operations=pgTable('cloud_operations',{
 id:uuid('id').primaryKey().defaultRandom(),tenantId:text('tenant_id').notNull(),resourceId:uuid('resource_id'),action:text('action').notNull(),state:text('state').notNull().default('queued'),detail:jsonb('detail').$type<Record<string,unknown>>().notNull().default({}),createdAt:timestamp('created_at',{withTimezone:true}).defaultNow().notNull()
});
export const audit=pgTable('cloud_audit',{
 id:uuid('id').primaryKey().defaultRandom(),tenantId:text('tenant_id').notNull(),actor:text('actor').notNull(),action:text('action').notNull(),resourceId:uuid('resource_id'),data:jsonb('data').$type<Record<string,unknown>>().notNull().default({}),createdAt:timestamp('created_at',{withTimezone:true}).defaultNow().notNull()
});
