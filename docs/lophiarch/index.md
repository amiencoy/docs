---
sidebar_label: 'Overview'
slug: /
---

# Lophiarch

Lophiarch is an AI-assisted reconnaissance and security-automation tool that
uses Telegram as its ChatOps interface, a provider-agnostic agent core for AI
tool selection, the Model Context Protocol (MCP) for tool exposure, and
disposable Docker containers for scanner execution.

Every active tool call passes through a runtime policy check: the chat must be
an authorized operator, the target must be inside a declared scope, and the tool
must be allowlisted. This documentation covers the current v2.2.2 behavior.

> Lophiarch is intended only for systems you own or are explicitly authorized
> to assess. Do not use it for unauthorized access, destructive testing, or
> disruption.

## Start Here

- [Getting Started](./getting-started.md)
- [Authorization and Scope](./authorization-and-scope.md)
- [Architecture Overview](./architecture.md)
- [Configuration](./configuration.md)
- [Deployment](./deployment.md)
- [Scanner and Tool Integrations](./scanners.md)
- [Security and Responsible Use](./security.md)
- [Troubleshooting](./troubleshooting.md)
- [Development and Contributing](./contributing.md)
- [Frequently Asked Questions](./faq.md)

## Current Capabilities

- Telegram-based natural-language interaction with operator-gated commands.
- Runtime authorization: `/authorize`, `/scope`, and `/revoke`, with
  hostname and CIDR scope matching.
- Provider-agnostic MCP tool selection with local or hosted AI models.
- Optional automatic Gemini fallback when the primary provider fails.
- Subdomain enumeration with Subfinder and an AlienVault OTX fallback.
- dnsx filtering for active subdomains.
- Nmap service and port discovery.
- Nuclei template-based vulnerability scanning.
- Ffuf content discovery with bundled SecLists wordlists.
- Concurrent execution of approved scanners, with PDF reporting after the
  scanner batch completes.
- In-memory scan aggregation and PDF generation with ReportLab.
- Docker and Helm-based deployment options.
- Automated main-image publishing to GitHub Container Registry.

## AI Provider Support

Lophiarch is not coupled to a single AI vendor. The same agent core and MCP tool
surface can be used with:

- Ollama (the default) for locally hosted models such as Qwen.
- vLLM, LM Studio, or llama.cpp for self-hosted inference.
- Any service that exposes an OpenAI-compatible chat-completions endpoint.
- Gemini as an optional compatibility provider or automatic fallback.

Select the backend with `AI_PROVIDER` and configure `AI_MODEL`, `AI_BASE_URL`,
`AI_API_KEY`, and `AI_TIMEOUT_SECONDS` as required by that backend. See
[Configuration](./configuration.md).

## Project Status

Lophiarch is under active development. The current stable release is
[v2.2.2](https://github.com/amiencoy/lophiarch/releases/tag/v2.2.2). Interfaces,
configuration, and deployment behavior may still change in later releases.

## Project Links

- [Source repository](https://github.com/amiencoy/lophiarch)
- [Issue tracker](https://github.com/amiencoy/lophiarch/issues)
- [Security policy](https://github.com/amiencoy/lophiarch/security/policy)
- [Contributing guidelines](https://github.com/amiencoy/lophiarch/blob/main/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/amiencoy/lophiarch/blob/main/CODE_OF_CONDUCT.md)
- [Sponsor Lophiarch](https://github.com/sponsors/amiencoy)

Lophiarch is available under your choice of the MIT License or Apache License
2.0: `MIT OR Apache-2.0`.
