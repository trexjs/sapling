# Operations runbook

## Pre-deploy checklist

- [ ] `kubectl config current-context` is the intended cluster.
- [ ] Container image exists and is accessible to cluster nodes.
- [ ] Image tag/digest is immutable and approved.
- [ ] `helm lint` succeeds.
- [ ] Rendered manifests reviewed and schema/policy checks pass.
- [ ] Probes match real application endpoints.
- [ ] Resource requests/limits are appropriate based on measurements.
- [ ] Ingress class, DNS, and TLS Secret are configured if ingress is enabled.
- [ ] Secret values are stored in an approved secret manager, not in Git.
- [ ] Rollback plan and monitoring owner are known.

## Common symptoms

### Pods are `ImagePullBackOff`
1. `kubectl describe pod <pod> -n <namespace>`
2. Check image repository/tag spelling and registry permissions.
3. For a private registry, confirm `image.pullSecrets` references a Secret in the same namespace.
4. Verify the image architecture is compatible with cluster nodes.

### Pods are `CrashLoopBackOff`
1. `kubectl logs <pod> -n <namespace> --previous`
2. `kubectl describe pod <pod> -n <namespace>`
3. Check required environment variables, startup command, port, file permissions, and read-only filesystem compatibility.
4. Do not disable security settings without understanding the application's requirement.

### Pods are `Running` but not `Ready`
1. Inspect readiness probe events and endpoint.
2. Confirm the app listens on the configured container port.
3. Ensure probe path returns an expected success status without login.
4. Check startup duration and dependencies.

### Service has no endpoints
1. `kubectl get endpointslices -n <namespace>`
2. Check Pod readiness and Service selector labels.
3. Check whether the application is listening on the target port.

### Ingress returns 404/502
1. Check ingress controller logs and ingress events.
2. Verify host/path rules, `ingressClassName`, Service name/port, and readiness.
3. Verify DNS and TLS Secret/host names.
4. Remember ingress behavior depends on the installed controller.

### HPA shows unknown metrics
1. Check `kubectl get hpa -n <namespace>`.
2. Verify metrics-server or the cluster's supported metrics API is healthy.
3. Ensure containers have CPU requests; CPU utilization is calculated relative to requests.

## Safe rollback

```bash
helm history <release> -n <namespace>
helm rollback <release> <revision> -n <namespace> --wait --timeout 5m
kubectl rollout status deployment/<deployment> -n <namespace>
```

After rollback, verify application-level health, ingress, metrics and logs. Coordinate database migrations separately.
