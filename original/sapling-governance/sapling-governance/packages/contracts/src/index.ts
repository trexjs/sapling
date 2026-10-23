import { z } from 'zod';
export const domain = z.enum(['consent','compliance']);
export const recordInput = z.object({ name: z.string().min(1).max(240), status: z.string().max(50).default('draft'), data: z.record(z.unknown()).default({}) });
export const decisionInput = z.object({ subjectId:z.string().min(1), domainId:z.string().min(1), policyVersion:z.string().min(1), categories:z.record(z.boolean()), region:z.string().default('unknown'), source:z.string().default('sdk') });
export const allowedConsentModules = ['banners','scans','preferences','enforcement','receipts','regulations','integrations','policies','privacy-requests','analytics','developers','administration'] as const;
export const allowedComplianceModules = ['frameworks','controls','evidence','monitoring','risks','audits'] as const;
export type RecordInput = z.infer<typeof recordInput>;
