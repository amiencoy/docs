---
sidebar_label: 'Troubleshooting'
---

# Troubleshooting

## Bot Fails During Startup

### Missing or invalid Telegram token

Symptoms may include token validation or authentication errors when
`src/bot.py` initializes. The process exits immediately when
`TELEGRAM_BOT_TOKEN` is unset.

Check:

```bash
grep -E '^(TELEGRAM_BOT_TOKEN|TELEGRAM_ALLOWED_CHAT_IDS|AI_PROVIDER|AI_MODEL|AI_BASE_URL|AI_API_KEY|AI_TIMEOUT_SECONDS)=' .env
```

Do not paste the values into an issue. Rotate any token that has been exposed.

### Python cannot import project modules

Run the bot from the repository root:

```bash
python src/bot.py
```

Verify dependencies:

```bash
python -m pip install -r requirements.txt
python -m compileall src
```

### Chat is refused before any agent call

`[REFUSED] | This chat is not configured as an operator.` means the chat ID is
not in `TELEGRAM_ALLOWED_CHAT_IDS`. Add the numeric chat ID, restart, and try
again. This check happens before the AI layer, so provider settings are
irrelevant here.

## Scans Are Denied

Denied calls are reported as `[DENIED] | <tool>: <CODE> - <reason>`.

| Code | Fix |
| --- | --- |
| `APPROVAL_REQUIRED` | Run `/authorize` for the target before scanning. |
| `SCOPE_REQUIRED` | The authorization exists but has no targets; authorize at least one. |
| `OUT_OF_SCOPE` | The target is not covered. Authorize the exact host, parent domain, or CIDR. |
| `TARGET_REQUIRED` | Restate the request with a concrete target. |
| `TOOL_NOT_ALLOWED` | The tool is missing from `allowed_tools` in `src/config/agent-policy.yaml`. |
| `TOOL_FORBIDDEN` | The tool is on the forbidden list; it is not supported. |

Check the active authorization with `/scope`. Remember that `/authorize` state
is stored per chat in memory: a bot restart clears it, so re-authorize after
every restart or redeploy.

For the full matching rules, see [Authorization and Scope](./authorization-and-scope.md).

## Docker Errors

### Cannot connect to the Docker daemon

Confirm Docker is running:

```bash
docker info
```

When the bot runs in a container, confirm the socket mount exists:

```bash
docker inspect lophiarch-bot --format '{{json .Mounts}}'
```

### Permission denied on docker.sock

The process lacks access to the Docker socket. Review host permissions and the
container runtime configuration. In Kubernetes, match `dockerSocket.groupId` to
the socket's group on the node. Do not make the socket world-writable as a quick
fix.

### Worker image not found

Build the missing image:

```bash
docker build -f Dockerfile.nmap -t lophiarch-nmap:latest .
docker build -f Dockerfile.ffuf -t lophiarch-ffuf:latest .
docker build -f Dockerfile.nuclei -t lophiarch-nuclei:latest .
```

List expected images:

```bash
docker image ls --format '{{.Repository}}:{{.Tag}}' | grep lophiarch
```

## AI Provider Errors

- Unknown provider: use `ollama`, `vllm`, `lmstudio`, `llamacpp`, `gemini`, or
  `openai-compatible`.
- Connection refused: verify `AI_BASE_URL` and confirm the model server is
  listening on an address reachable from the Lophiarch process or container.
- Model not found: verify `AI_MODEL`; for Ollama, run `ollama pull MODEL_NAME`.
- `401` or `403`: verify `AI_API_KEY` and provider account permissions.
- `429`: reduce request frequency and check the selected provider quota.
- Timeout: raise `AI_TIMEOUT_SECONDS` (default `300`) if the model is slow, but
  investigate a hung endpoint first.
- Missing custom endpoint: `AI_PROVIDER=openai-compatible` requires both
  `AI_BASE_URL` and `AI_MODEL`.
- Invalid tool-call output: confirm the selected model supports reliable
  OpenAI-compatible function or tool calling.
- `AI_TEMPERATURE` or `AI_TIMEOUT_SECONDS` rejected at startup: both must parse
  as numbers, and timeout must be greater than zero.

### Gemini fallback did not engage

Fallback is only created when all of these are true:

- `AI_PROVIDER` is not `gemini`.
- `GEMINI_API_KEY` is set and non-empty.
- The primary provider raises a provider error.

Check the logs for `Primary AI provider failed ... trying Gemini fallback`. If
the primary provider answers successfully, Gemini is never contacted. That is
the intended behavior, not a fault.

Sanitize provider responses before sharing logs publicly.

## Empty Scanner Results

Empty output does not always mean the target is secure.

Check:

- Target formatting and DNS resolution.
- Authorization-scoped network access.
- Scanner container logs or stderr.
- Whether a WAF, rate limit, firewall, or timeout affected the scan.
- Whether the selected mode is appropriate.
- Whether upstream images or templates changed.

## PDF Is Not Sent

Confirm that:

- At least one scanner ran before `create_pdf_report`.
- The scanner was authorized and not denied; a denied call writes nothing to
  scan memory.
- `generated_reports/` is writable.
- The bot can read the generated path.
- Telegram accepts the resulting document.

Container logs may show `Failed to send PDF` when delivery fails. Report files
follow `generated_reports/Lophiarch_Report_<timestamp>.pdf`.

## Helm Pod Does Not Start

```bash
helm lint deploy/helm
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

The current chart requires `/var/run/docker.sock` on the node. Containerd-only
nodes will not satisfy this requirement by default. A `permission denied` on the
socket usually means `dockerSocket.groupId` does not match the node.

## Opening a Bug Report

Use the Bug Report issue form and include:

- Commit or image tag.
- Deployment method and environment.
- Minimal authorized reproduction.
- Expected and actual behavior.
- Sanitized logs, including any denial code.

Report suspected security vulnerabilities privately instead.
