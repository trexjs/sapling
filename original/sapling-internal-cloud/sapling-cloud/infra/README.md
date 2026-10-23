# Infrastructure adapters (deliberately unimplemented)
Place Terraform/OpenTofu modules, Kubernetes operators/controllers, provider adapters and credentials integrations here. **No cloud resources are actually provisioned by the API.** Never equate `requested` with `ready`.

Suggested structure: `tofu/`, `kubernetes/`, `adapters/{compute,network,storage,secrets,security,backup,fleet}`, `policies/`, `gitops/`.
