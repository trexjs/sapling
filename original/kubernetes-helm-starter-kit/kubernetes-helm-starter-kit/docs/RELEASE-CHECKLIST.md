# Release checklist

- [ ] Increment chart version if templates/defaults/schema changed.
- [ ] Update image repository and immutable tag/digest in the environment values file.
- [ ] Run `helm lint` and `helm template`.
- [ ] Validate against the actual target Kubernetes version.
- [ ] Review security context and writable paths for this image.
- [ ] Verify probes, resource sizing, topology, and autoscaling behavior.
- [ ] Verify ingress class, DNS, TLS, secrets, metrics and NetworkPolicy assumptions.
- [ ] Deploy to staging and run smoke/load tests.
- [ ] Confirm rollback revision and database migration compatibility.
- [ ] Monitor rollout, error rate, latency, saturation, and logs.
