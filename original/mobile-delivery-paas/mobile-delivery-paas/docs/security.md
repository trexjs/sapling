# Security boundaries

- Never store store credentials or signing private keys in database plaintext. Use OpenBao or a managed secret backend with short-lived access.
- Treat repository code as untrusted. Use isolated disposable VMs/Mac hosts, egress restrictions, no host mounts, and a scoped credential broker. `RUNNER_MODE=local` is for controlled lab use only.
- Pin Git commits, dependencies, runner images, and build tools. Add provenance attestations, SBOM, malware/dependency checks.
- Validate Git webhook signatures; use webhook deduplication and per-tenant quotas.
- Restrict `BOOTSTRAP_ADMIN_TOKEN` and disable bootstrap after provisioning.
- OTA updates require protocol-compliant signed manifests and immutable content-addressed assets. Add stable install IDs and anti-replay protection.
- Current dashboard holds the API key only in component memory, not localStorage.
