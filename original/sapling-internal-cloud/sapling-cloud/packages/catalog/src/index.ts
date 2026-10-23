export const capabilityCatalog = [
  {
    "id": "A-compute",
    "title": "Compute",
    "resources": [
      "applications",
      "deployments",
      "functions",
      "workers",
      "autoscaling",
      "resource-quotas",
      "schedules",
      "placement"
    ]
  },
  {
    "id": "B-network",
    "title": "Network",
    "resources": [
      "networks",
      "dns-zones",
      "ingresses",
      "load-balancers",
      "certificates",
      "network-policies",
      "service-discovery",
      "private-endpoints"
    ]
  },
  {
    "id": "C-secrets",
    "title": "Secrets",
    "resources": [
      "secrets",
      "secret-versions",
      "key-rings",
      "rotations",
      "configurations",
      "certificates",
      "workload-credentials"
    ]
  },
  {
    "id": "D-storage",
    "title": "Storage",
    "resources": [
      "buckets",
      "volumes",
      "storage-classes",
      "snapshots",
      "replication-policies",
      "lifecycle-policies"
    ]
  },
  {
    "id": "E-observability",
    "title": "Observability",
    "resources": [
      "log-sources",
      "metric-sources",
      "trace-sources",
      "alert-rules",
      "slo-policies",
      "incidents",
      "status-pages",
      "uptime-checks"
    ]
  },
  {
    "id": "F-security",
    "title": "Security",
    "resources": [
      "vulnerability-scans",
      "sboms",
      "image-signatures",
      "admission-policies",
      "security-findings",
      "posture-rules",
      "runtime-alerts"
    ]
  },
  {
    "id": "G-provisioning",
    "title": "Provisioning",
    "resources": [
      "resource-requests",
      "resource-inventory",
      "stacks",
      "plans",
      "quotas",
      "policies",
      "reconciliation-runs",
      "cleanup-jobs"
    ]
  },
  {
    "id": "H-finops",
    "title": "Finops",
    "resources": [
      "usage-meters",
      "budgets",
      "cost-allocations",
      "price-books",
      "anomaly-rules",
      "idle-resource-reports",
      "showback-reports"
    ]
  },
  {
    "id": "I-recovery",
    "title": "Recovery",
    "resources": [
      "backup-policies",
      "backup-runs",
      "restore-jobs",
      "recovery-plans",
      "failover-runs",
      "dr-drills",
      "recovery-objectives"
    ]
  },
  {
    "id": "J-release",
    "title": "Release",
    "resources": [
      "environments",
      "preview-environments",
      "release-candidates",
      "rollouts",
      "approvals",
      "rollbacks",
      "provenance-records"
    ]
  },
  {
    "id": "K-devex",
    "title": "Devex",
    "resources": [
      "service-catalog",
      "templates",
      "scaffolding-runs",
      "owners",
      "runbooks",
      "scorecards",
      "architecture-decisions",
      "readiness-checks"
    ]
  },
  {
    "id": "L-fleet",
    "title": "Fleet",
    "resources": [
      "clusters",
      "regions",
      "placements",
      "upgrade-plans",
      "migration-jobs",
      "fleet-capacity",
      "residency-policies",
      "regional-failovers"
    ]
  }
] as const;
