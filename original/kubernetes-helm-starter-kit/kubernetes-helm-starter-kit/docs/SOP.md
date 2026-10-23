# SOP: Customize and deploy the Helm chart

## Purpose

This SOP explains how to adapt the starter chart for a UI frontend or stateless API, validate the rendered Kubernetes resources, deploy safely, and recover if a release fails.

## Step 0 — Understand the deployment model

- **Container image**: the packaged application built by your UI/API build pipeline.
- **Pod**: the running instance of the container.
- **Deployment**: manages replicas and rolling updates.
- **Service**: stable in-cluster address for Pods.
- **Ingress**: optional HTTP/HTTPS entry point, implemented by an installed ingress controller.
- **Helm chart**: templates plus defaults; **values files** supply environment-specific settings.

Keep application code, container image creation, and Kubernetes deployment configuration as separate concerns.

## Step 1 — Install/check tools

```bash
kubectl version --client
helm version
kubectl config current-context
kubectl cluster-info
```

Confirm the current context points to the intended cluster before changing anything. Do not run production commands against an unverified context.

## Step 2 — Set your application image

Edit `environments/values-dev.yaml`:

```yaml
image:
  repository: registry.example.com/team/my-ui
  tag: "1.4.2"
  pullPolicy: IfNotPresent
```

- `repository`: registry path where the built image lives.
- `tag`: use an immutable release tag or digest in production; avoid `latest` because it makes rollbacks and audits ambiguous.
- `pullPolicy`: choose based on your image publication policy. Private registries may require `image.pullSecrets` referencing a pre-created Kubernetes Secret.

Build and push the image separately using your CI pipeline. A Helm chart does not build the UI or API image.

## Step 3 — Match the application's listening port

The container must actually listen on `containerPort`. Update `containerPort` and `containerPortName` in the values file if necessary. The Service's `service.port` is the port clients use to reach the Service; `targetPort` maps to the named container port.

Example: app listens on 3000, Service should be reached on 80:

```yaml
containerPort: 3000
service:
  port: 80
```

Do not assume the container port from the Dockerfile alone; verify the actual server startup configuration.

## Step 4 — Configure health checks

`readinessProbe` determines when a Pod can receive traffic. `livenessProbe` restarts a container that remains unhealthy. `startupProbe` is useful for slow-starting apps and delays liveness/readiness evaluation until startup succeeds.

Change probe `path` to an endpoint that returns success without authentication and without relying on optional downstream systems unless that is intentional. For SPAs, `/` may work. For APIs, a dedicated `/health/ready` and `/health/live` endpoint is often better.

Do not simply increase delays to hide a broken application. Check logs and actual startup time first.

## Step 5 — Configure environment variables and secrets

- Put non-sensitive configuration in `env` or ConfigMaps.
- Reference existing ConfigMaps with `envFromConfigMaps`.
- Reference existing Kubernetes Secrets with `envFromSecrets`.
- Never commit secret values, access tokens, certificates, or passwords to Git or a values file.
- Prefer your organization's secret manager or External Secrets workflow. Confirm encryption at rest and RBAC controls for the cluster.

Example non-secret value:

```yaml
env:
  - name: NODE_ENV
    value: production
```

## Step 6 — Set resources and replicas

Set `resources.requests` based on measured baseline usage; requests influence scheduling and CPU utilization calculations. Limits cap resource use, but overly low CPU limits can throttle applications and overly low memory limits can cause OOM kills.

Start with conservative values, load-test, inspect metrics, then tune. `replicaCount` is used when autoscaling is disabled. If HPA is enabled, configure `minReplicas`, `maxReplicas`, and CPU target; the cluster needs a functioning metrics API.

## Step 7 — Configure external access (only if needed)

Set `ingress.enabled: true` only when an ingress controller is installed. Configure `className`, host, path and TLS Secret. DNS must point to the ingress endpoint, and the TLS Secret must exist in the release namespace unless your platform provides a different supported mechanism.

The sample `nginx` class and `example.com` hosts are placeholders, not universal defaults. Some clusters use Gateway API or cloud load balancers instead.

## Step 8 — Validate before installing

```bash
helm lint ./charts/app-service
helm template demo ./charts/app-service \
  --namespace demo \
  -f environments/values-dev.yaml > rendered.yaml
```

Review `rendered.yaml`. If available, validate against the target Kubernetes version using `kubeconform` or your standard policy tools. Do not commit generated output containing sensitive data.

Optional cluster dry run:

```bash
kubectl create namespace demo --dry-run=client -o yaml
helm upgrade --install demo ./charts/app-service \
  -n demo --create-namespace \
  -f environments/values-dev.yaml \
  --dry-run --debug
```

A Helm dry run is useful, but it does not prove the application will start or that all cluster dependencies exist.

## Step 9 — Install/upgrade in a non-production namespace first

```bash
helm upgrade --install demo ./charts/app-service \
  --namespace demo --create-namespace \
  -f environments/values-dev.yaml \
  --wait --timeout 5m
```

Then verify:

```bash
helm status demo -n demo
kubectl rollout status deployment/demo-app-service -n demo
kubectl get pods,svc,ingress -n demo
kubectl describe deployment/demo-app-service -n demo
kubectl logs deployment/demo-app-service -n demo --all-containers=true
```

If your release name or `nameOverride` changes, the Deployment name may differ. Use `kubectl get deployments -n demo` to find the actual name.

## Step 10 — Promote to staging/production

1. Build once and promote the same immutable image artifact.
2. Review environment values in code review.
3. Verify registry access, TLS, DNS, resource capacity, metrics, policies, and secret injection.
4. Run lint/template/schema/security checks in CI.
5. Deploy to staging and run smoke tests/load tests as appropriate.
6. Deploy to production using your approved change process and monitor rollout and application metrics.

Do not use the sample production values unchanged. They include placeholder registry, hostname, TLS Secret, and resource values.

## Step 11 — Roll back when required

```bash
helm history demo -n demo
helm rollback demo <REVISION> -n demo --wait --timeout 5m
```

Rollback restores a previous Helm release configuration; it does not automatically reverse database migrations or external side effects. Plan database schema changes for backward compatibility.

## Step 12 — Keep the chart maintainable

- Change chart `version` for chart changes and `appVersion` for the application version represented by the chart metadata.
- Review generated manifests whenever templates change.
- Add tests for any new conditional template.
- Pin tool versions in CI.
- Document every new value in `values.yaml` and `docs/CONFIGURATION-REFERENCE.md`.
- Prefer explicit, reviewed templates over arbitrary raw manifest injection.
