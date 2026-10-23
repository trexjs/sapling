# Configuration reference: what to change, why, and when

## Golden rule

Keep generic behavior in `charts/app-service/`; keep environment differences in `environments/values-*.yaml`. Avoid editing templates for normal application onboarding. Edit templates only when you are intentionally changing the reusable platform contract.

| Requirement | File / value | Why it matters | When to change |
|---|---|---|---|
| App image | `environments/values-*.yaml` → `image.repository`, `image.tag` | Selects the artifact Kubernetes runs | Every release or registry migration |
| Container port | `containerPort` | Must match the port the app listens on | App server port changes |
| Service port | `service.port` | Stable in-cluster access port | Consumers need a different service port |
| External URL | `ingress.enabled`, `ingress.className`, `ingress.hosts` | Routes HTTP traffic from ingress to Service | Exposing a web app/API |
| HTTPS | `ingress.tls` | Associates host with TLS Secret | Enabling TLS; Secret must already exist |
| Health checks | `livenessProbe`, `readinessProbe`, `startupProbe` | Controls traffic eligibility and restart behavior | App health endpoints/startup profile changes |
| Scale baseline | `replicaCount` | Number of replicas when HPA is disabled | Capacity/availability changes |
| Autoscaling | `autoscaling.*` | Adds an HPA based on resource metrics | Metrics API exists and load patterns justify it |
| CPU/memory | `resources.requests`, `resources.limits` | Scheduling, capacity, and resource containment | After profiling/load tests or workload changes |
| Service account | `serviceAccount.*` | Defines workload identity and token mounting | App needs Kubernetes API access or platform identity |
| Non-secret env | `env` | Supplies application runtime configuration | Feature flags, runtime mode, public endpoints |
| ConfigMap refs | `envFromConfigMaps` | Injects external non-secret configuration | Configuration managed separately |
| Secret refs | `envFromSecrets` | Injects secret data from pre-created objects | Credential/certificate integration |
| Disruption safety | `podDisruptionBudget.*` | Limits voluntary simultaneous disruptions | Multiple replicas and availability requirements |
| Network policy | `networkPolicy.*` | Restricts pod ingress/egress when supported | After mapping all app traffic and cluster policy support |
| Scheduling | `nodeSelector`, `affinity`, `tolerations` | Places workloads on suitable nodes | Dedicated pools, hardware, isolation, compliance |
| Graceful shutdown | `terminationGracePeriodSeconds` | Gives app time to stop accepting traffic and finish requests | Long requests or shutdown hooks |

## File-by-file guide

### `charts/app-service/Chart.yaml`
Chart metadata and version. Bump `version` when chart templates/defaults/schema change. `appVersion` is informational application metadata; it does not select the container image by itself.

### `charts/app-service/values.yaml`
Documented defaults. Every new option should have a comment explaining what it controls. Choose safe defaults that work for the intended class of applications, not values that pretend to fit every cluster.

### `charts/app-service/values.schema.json`
Schema validation for user-supplied values. Extend it when introducing important configuration constraints. A schema is not a substitute for policy or runtime tests.

### `charts/app-service/templates/`
Templated Kubernetes objects:
- `deployment.yaml`: Pods, rollout strategy, probes, security context, resources.
- `service.yaml`: stable network endpoint inside the cluster.
- `serviceaccount.yaml`: dedicated workload identity.
- `ingress.yaml`: optional HTTP routing.
- `hpa.yaml`: optional CPU/memory horizontal autoscaling.
- `pdb.yaml`: optional voluntary-disruption protection.
- `networkpolicy.yaml`: optional pod traffic policy; requires a compatible network plugin and careful traffic design.
- `_helpers.tpl`: shared naming and label functions.

### `environments/values-dev.yaml`
Local/feature development defaults. Keep credentials out of this file.

### `environments/values-staging.yaml`
A realistic pre-production example. Replace example image, hostname, ingress class, and TLS Secret name.

### `environments/values-prod.yaml`
Production-shaped example only. It is deliberately explicit about placeholders. Review security, SLOs, cost/capacity, and cluster-specific integration before use.

### `.github/workflows/helm-validate.yml`
CI checks that lint the chart and render manifests. Add schema validation, policy checks, image scanning, signature verification, and deployment tests according to your platform's toolchain.

## Security baseline and caveats

- Container runs as non-root, drops Linux capabilities, disallows privilege escalation, uses a RuntimeDefault seccomp profile, and requests a read-only root filesystem.
- Some images require writable temporary paths or a non-root-compatible UID. If so, add a narrowly scoped `emptyDir` volume/mount or compatible UID rather than disabling security controls globally.
- Service account token automount is disabled by default. Enable only when required.
- Resource defaults are examples, not sizing recommendations for every application.
- NetworkPolicy is disabled by default because DNS, ingress-controller paths, metrics, and application egress differ by cluster. When enabled, empty ingress/egress peer lists deny that direction; test carefully before enabling in production.
- PodDisruptionBudget protects only against voluntary disruptions and does not replace replicas, readiness probes, topology spreading, or capacity planning.
- Ingress is not automatically provisioned by Kubernetes; a controller and DNS/TLS setup are required.
- This chart does not provision databases, managed identities, certificates, secret stores, monitoring stacks, or cloud infrastructure.
