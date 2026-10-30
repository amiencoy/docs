---
sidebar_label: 'Getting Started'
---

# Getting Started

## Prerequisites

- Git
- Python 3.11 or later
- Docker Engine with permission to access its daemon
- A Telegram bot token
- An AI backend: Ollama is the default; a hosted OpenAI-compatible provider is optional
- Helm and a compatible Kubernetes cluster only for Helm deployment

## Clone and Configure

```bash
git clone https://github.com/amiencoy/lophiarch.git
cd lophiarch
cp .env.example .env
```

Set the required values in `.env`:

```dotenv
TELEGRAM_BOT_TOKEN=replace_with_your_bot_token
TELEGRAM_ALLOWED_CHAT_IDS=replace_with_your_numeric_chat_id

AI_PROVIDER=ollama
AI_MODEL=qwen3:8b
AI_BASE_URL=http://localhost:11434/v1/chat/completions
AI_API_KEY=
AI_TEMPERATURE=0
AI_TIMEOUT_SECONDS=300
```

Never commit `.env`. Use development-only credentials while testing changes.

## Prepare the Default Local Model

The default setup uses Ollama with Qwen and does not require a cloud API key:

```bash
ollama pull qwen3:8b
ollama serve
```

When Lophiarch itself runs in Docker, point `AI_BASE_URL` to an address that is
reachable from the container, such as
`http://host.docker.internal:11434/v1/chat/completions`. For another local or
hosted backend, choose a supported provider preset or set
`AI_PROVIDER=openai-compatible` with its endpoint, model, and API key.

## Build the Scanner Workers

Lophiarch invokes Nmap, Ffuf, and Nuclei through specifically named local
images. Build them before starting the bot:

```bash
docker build -f Dockerfile.nmap -t lophiarch-nmap:latest .
docker build -f Dockerfile.ffuf -t lophiarch-ffuf:latest .
docker build -f Dockerfile.nuclei -t lophiarch-nuclei:latest .
```

Subfinder and dnsx use upstream ProjectDiscovery images and are pulled by Docker
when first needed.

## Run with Docker

```bash
docker build -t lophiarch:local .

docker run -d \
  --name lophiarch-bot \
  --restart unless-stopped \
  --add-host=host.docker.internal:host-gateway \
  --env-file .env \
  -v /var/run/docker.sock:/var/run/docker.sock \
  lophiarch:local
```

The Docker socket mount allows the main Lophiarch container to start disposable
scanner workers on the host Docker daemon. This is a highly privileged trust
boundary. See [Security and Responsible Use](./security.md).

Check startup logs:

```bash
docker logs -f lophiarch-bot
```

## Run from a Python Environment

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python src/bot.py
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Docker Engine must still be running because scanner modules call `docker run`.

## Authorize Before the First Scan

Lophiarch enforces authorization at runtime. A scan request without a declared
scope is refused with `[DENIED] | ... SCOPE_REQUIRED`, so authorize the
engagement first:

```text
/authorize example.com ticket=ENG-001
```

Verify it with `/scope`, then request the scan:

```text
scan example.com with nmap, ffuf and nuclei, then create a PDF report
```

Finish with `/revoke` when the engagement is over. Authorizations are kept per
chat in memory and disappear when the bot restarts.

Only authorize non-production targets you own or are explicitly authorized to
assess. See [Authorization and Scope](./authorization-and-scope.md) for the matching
rules and denial codes.

## Next Steps

- Review all [configuration options](./configuration.md).
- Understand the [architecture and execution flow](./architecture.md).
- Read the [troubleshooting guide](./troubleshooting.md) if the bot or workers fail.
