---
sidebar_label: 'Configuration'
---

# Configuration

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | Yes | Authenticates the Telegram bot used by `aiogram`. |
| `TELEGRAM_ALLOWED_CHAT_IDS` | Recommended | Comma-separated numeric chat IDs allowed to use the bot. Without it, every chat is refused. |
| `TELEGRAM_CHAT_ID` | Legacy | Read as a fallback when `TELEGRAM_ALLOWED_CHAT_IDS` is unset. |
| `AI_PROVIDER` | No | Provider preset. Defaults to `ollama`. |
| `AI_MODEL` | Provider-dependent | Model identifier. Defaults to `qwen3:8b` with Ollama. |
| `AI_BASE_URL` | Provider-dependent | OpenAI-compatible chat-completions endpoint. |
| `AI_API_KEY` | Provider-dependent | Credential for providers that require authentication. |
| `AI_TEMPERATURE` | No | Sampling temperature; defaults to `0`. Must be numeric. |
| `AI_TIMEOUT_SECONDS` | No | Provider request timeout in seconds; defaults to `300`. Must be greater than zero. |
| `GEMINI_API_KEY` | No | Enables automatic Gemini fallback when the primary provider fails. Also used as the API key when `AI_PROVIDER=gemini`. |
| `GEMINI_MODEL` | No | Fallback model; defaults to `gemini-3.5-flash-lite`. |
| `GEMINI_BASE_URL` | No | Overrides the Gemini OpenAI-compatible endpoint. |

Create a local configuration from the example:

```bash
cp .env.example .env
```

Do not commit real values. The repository `.gitignore` excludes `.env`, but
contributors must still review commits and logs for accidental secrets.

## AI Providers

Lophiarch uses one OpenAI-compatible provider interface across local and hosted
models.

| `AI_PROVIDER` | Default endpoint | Default model | API key | Notes |
| --- | --- | --- | --- | --- |
| `ollama` | `http://localhost:11434/v1/chat/completions` | `qwen3:8b` | Not required | Default configuration. |
| `vllm` | `http://localhost:8000/v1/chat/completions` | `Qwen/Qwen3-8B` | Not required by default | |
| `lmstudio` | `http://localhost:1234/v1/chat/completions` | `local-model` | Not required by default | |
| `llamacpp` | `http://localhost:8080/v1/chat/completions` | `local-model` | Not required by default | |
| `gemini` | `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions` | `gemini-3.5-flash-lite` | Required | Uses `AI_API_KEY`, or `GEMINI_API_KEY` when that is empty. |
| `openai-compatible` | Set with `AI_BASE_URL` | Set with `AI_MODEL` | Provider-dependent | Both endpoint and model are required. |

A local default configuration:

```dotenv
AI_PROVIDER=ollama
AI_MODEL=qwen3:8b
AI_BASE_URL=http://localhost:11434/v1/chat/completions
AI_API_KEY=
AI_TEMPERATURE=0
AI_TIMEOUT_SECONDS=300
```

For an unlisted service, use `AI_PROVIDER=openai-compatible` and supply its
chat-completions URL, model identifier, and API key when required.

## Gemini Fallback

Setting `GEMINI_API_KEY` while the primary provider is anything other than
`gemini` enables automatic failover. Lophiarch calls Gemini only when the
primary provider cannot connect, times out, returns an HTTP error, or produces
an invalid chat-completions response. When the primary provider is healthy, no
prompt or tool schema is sent to Gemini.

```dotenv
GEMINI_API_KEY=your-google-ai-studio-key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Two special cases:

- If `AI_PROVIDER=openai-compatible` and `AI_BASE_URL` or `AI_MODEL` is missing,
  Lophiarch starts with Gemini directly when the fallback key exists.
- Remove `GEMINI_API_KEY` to guarantee local-only inference.

Fallback changes only model transport. Authorization, scope validation, tool
policy, and MCP execution stay enforced by the same runtime.

See [Local and Self-Hosted AI Providers](https://github.com/amiencoy/lophiarch/blob/main/docs/LOCAL_MODELS.md)
for provider-specific commands.

## Runtime Policy

`src/config/agent-policy.yaml` controls which tools may run and what they
require. The shipped policy denies unknown tools and requires a declared scope
for every active scanner.

```yaml
authorization:
  default_deny: true
  require_declared_scope: true

allowed_tools:
  - name: execute_nmap
    requires_approval: true
    target_fields: [target]

forbidden_tools:
  - exploit_target
  - establish_persistence
  - dump_credentials
  - destructive_test
```

Review this file before deploying a modified image. It is read at runtime, so a
policy edit requires a bot restart. See
[Authorization and Scope](./authorization-and-scope.md).

## Worker Image Names

The current scanner modules expect these exact tags:

| Capability | Image |
| --- | --- |
| Nmap | `lophiarch-nmap:latest` |
| Ffuf | `lophiarch-ffuf:latest` |
| Nuclei | `lophiarch-nuclei:latest` |
| Subfinder | `projectdiscovery/subfinder:latest` |
| dnsx | `projectdiscovery/dnsx:latest` |

If a custom build uses different names, update the corresponding engine module
or retag the image.

## Nmap Modes

| Mode | Current behavior |
| --- | --- |
| `quick` | Adds `-F` for the common-port set. |
| `default` | Uses service detection with `-sV -Pn`. |
| `deep` | Adds all-port scanning and default scripts with `-p- -sC`. |

All modes request XML output for parsing.

## Ffuf Modes

| Mode | Wordlist |
| --- | --- |
| `quick` or `default` | `/wordlists/quick.txt` |
| `deep` | `/wordlists/deep.txt` |

The custom image downloads its wordlists from SecLists during image build.
`deep` is also the tool default when no mode is supplied.

## Helm Values

The chart exposes provider-neutral values:

```yaml
telegram:
  botToken: ""
  allowedChatIds: ""

ai:
  provider: ollama
  model: qwen3:8b
  baseUrl: http://ollama.default.svc.cluster.local:11434/v1/chat/completions
  temperature: "0"
  timeoutSeconds: "300"
  apiKey: ""
  geminiApiKey: ""

dockerSocket:
  groupId: 999
```

A non-empty `geminiApiKey` enables the same automatic failover described above.
Override secrets at installation time or through a secure values workflow.
Avoid committing plaintext production values.

## Generated Reports

PDFs are created in `generated_reports/`. The directory is ignored by Git and
uses `Lophiarch_Report_<timestamp>.pdf` filenames. Inside a disposable main
container, reports disappear when the container is removed unless a volume is
mounted.
