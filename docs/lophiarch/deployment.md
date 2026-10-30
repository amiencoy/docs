---
sidebar_label: 'Deployment'
---

# Deployment

## Docker Deployment

Build the worker images first:

```bash
docker build -f Dockerfile.nmap -t lophiarch-nmap:latest .
docker build -f Dockerfile.ffuf -t lophiarch-ffuf:latest .
docker build -f Dockerfile.nuclei -t lophiarch-nuclei:latest .
```

Build and run the main bot:

```bash
docker build -t lophiarch:2.2.2 .

docker run -d \
  --name lophiarch-bot \
  --restart unless-stopped \
  --add-host=host.docker.internal:host-gateway \
  --env-file .env \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v lophiarch-reports:/app/generated_reports \
  lophiarch:2.2.2
```

`--add-host` is only needed when the container must reach a model server on the
host, such as Ollama on `host.docker.internal`. The report volume is optional.
The Docker socket is required by the current worker architecture.

## GitHub Container Registry

The CI workflow builds the main image on relevant pushes to `main` and
publishes:

```text
ghcr.io/amiencoy/lophiarch:latest
ghcr.io/amiencoy/lophiarch:sha-<short-commit>
```

Registry access depends on the package visibility and authentication configured
in GitHub. Scanner worker images are currently built separately and are not
published by the main-image workflow.

## Helm Deployment

Validate the chart:

```bash
helm lint deploy/helm
```

Install:

```bash
helm install recon-bot deploy/helm \
  --set image.repository=ghcr.io/amiencoy/lophiarch \
  --set image.tag=2.2.2 \
  --set telegram.botToken="YOUR_TELEGRAM_TOKEN" \
  --set telegram.allowedChatIds="YOUR_CHAT_ID" \
  --set ai.provider=ollama \
  --set ai.model=qwen3:8b \
  --set ai.baseUrl="http://ollama.default.svc.cluster.local:11434/v1/chat/completions" \
  --set ai.timeoutSeconds=300
```

The Ollama Service URL must be reachable from the Lophiarch pod. To use a
different local or hosted backend, set `ai.provider`, `ai.model`, `ai.baseUrl`,
`ai.apiKey`, and `ai.timeoutSeconds` as required. Set `ai.geminiApiKey` to
enable automatic fallback.

The chart runs as UID/GID `65532` with no added capabilities, a read-only root
filesystem, and `dockerSocket.groupId` added as a supplemental group. Match that
group ID to the Docker socket group on the node or the socket mount fails with a
permission error.

For production, prefer a protected values mechanism or external secret manager
instead of placing secrets directly in shell history.

## Kubernetes Runtime Limitation

The current chart mounts the host path `/var/run/docker.sock`. Therefore:

- The node must expose a compatible Docker socket.
- A containerd-only cluster, including many default K3s installations, will not
  work without an additional Docker-compatible setup or an architectural change.
- The pod obtains powerful access to the host Docker daemon.
- Required worker images must be available to that daemon.
- The current chart does not configure `imagePullSecrets` for a private GHCR
  package.

Review these constraints before treating the chart as production-ready.

## Upgrade

```bash
helm upgrade recon-bot deploy/helm \
  --reuse-values \
  --set image.tag=sha-<commit>
```

Pinning a commit tag is more reproducible than using `latest`. The chart itself
is versioned `2.2.2`; `image.tag` defaults to `latest`, so set it explicitly.

## Removal

```bash
helm uninstall recon-bot
```

Review generated Secrets, volumes, worker images, and reports separately; Helm
does not necessarily remove every external artifact.

## Post-Deployment Check

1. Send `/start` from an allowed chat. A non-configured chat is refused.
2. Send `/scope` and confirm it reports no active authorization.
3. Run `/authorize <authorized-target> ticket=<id>`, then a small scan.
4. Confirm scan workers start and the PDF arrives in Telegram.

If scans are denied, read [Authorization and Scope](./authorization-and-scope.md)
before changing the policy file.

## Migration

Read the [migration guide](https://github.com/amiencoy/lophiarch/blob/main/docs/MIGRATION.md) before changing scanner image names or Helm deployments.
