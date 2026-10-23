export const modules = {
  "campaigns": [
    "name",
    "channel",
    "status",
    "budget"
  ],
  "content_assets": [
    "title",
    "kind",
    "status",
    "url"
  ],
  "audiences": [
    "name",
    "description",
    "segment"
  ],
  "marketing_events": [
    "contactId",
    "campaignId",
    "eventType",
    "value"
  ],
  "jobs": [
    "title",
    "department",
    "status",
    "location"
  ],
  "candidates": [
    "name",
    "email",
    "jobId",
    "stage"
  ],
  "employees": [
    "name",
    "email",
    "department",
    "status",
    "managerId"
  ],
  "leave_requests": [
    "employeeId",
    "startDate",
    "endDate",
    "status"
  ],
  "performance_reviews": [
    "employeeId",
    "period",
    "rating",
    "notes"
  ],
  "training_courses": [
    "title",
    "description",
    "status"
  ],
  "training_enrollments": [
    "employeeId",
    "courseId",
    "status"
  ],
  "contacts": [
    "name",
    "email",
    "company",
    "source"
  ],
  "leads": [
    "contactId",
    "source",
    "status",
    "score"
  ],
  "opportunities": [
    "leadId",
    "name",
    "stage",
    "amount"
  ],
  "quotes": [
    "opportunityId",
    "status",
    "amount",
    "validUntil"
  ],
  "contracts": [
    "opportunityId",
    "status",
    "signedAt"
  ],
  "customers": [
    "name",
    "email",
    "company",
    "status"
  ],
  "onboardings": [
    "customerId",
    "status",
    "ownerId"
  ],
  "tickets": [
    "customerId",
    "subject",
    "priority",
    "status"
  ],
  "sla_policies": [
    "name",
    "priority",
    "responseHours",
    "resolutionHours"
  ],
  "feedback": [
    "customerId",
    "rating",
    "comment"
  ],
  "renewals": [
    "customerId",
    "dueDate",
    "amount",
    "status"
  ],
  "tasks": [
    "title",
    "ownerId",
    "status",
    "dueDate"
  ],
  "activities": [
    "entityType",
    "entityId",
    "description",
    "actorId"
  ]
} as const;
