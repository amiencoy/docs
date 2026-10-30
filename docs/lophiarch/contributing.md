---
sidebar_label: 'Development'
---

# Development and Contributing

The canonical contribution rules are maintained in
[`CONTRIBUTING.md`](https://github.com/amiencoy/lophiarch/blob/main/CONTRIBUTING.md).
This page provides a short navigation guide.

## Before You Start

- Read the [Code of Conduct](https://github.com/amiencoy/lophiarch/blob/main/CODE_OF_CONDUCT.md).
- Search existing issues and roadmap items.
- Use the dedicated integration form for new scanners or tools.
- Discuss substantial architecture, policy, or security-boundary changes before
  coding.
- Use only authorized, non-production targets during development.

## Local Validation

```bash
python -m compileall src
python -m pytest tests -q
docker build -t lophiarch:test .
```

Build any scanner worker affected by the change:

```bash
docker build -f Dockerfile.nmap -t lophiarch-nmap:latest .
docker build -f Dockerfile.ffuf -t lophiarch-ffuf:latest .
docker build -f Dockerfile.nuclei -t lophiarch-nuclei:latest .
```

For Helm changes:

```bash
helm lint deploy/helm
```

## Test Coverage

The suite under `tests/` covers the behavior that must not regress silently:

| Area | Test module |
| --- | --- |
| Policy allow, deny, scope, and approval decisions | `test_agent_policy.py` |
| Tool planning, explicit multi-tool completion, parallel execution | `test_agent_core.py` |
| Telegram operator gate and `/authorize`, `/scope`, `/revoke` | `test_telegram_authorization.py` |
| Provider presets and factory errors | `test_provider_factory.py` |
| Gemini fallback behavior | `test_provider_fallback.py` |
| Local OpenAI-compatible transport | `test_local_provider.py` |
| MCP stdio integration | `test_mcp_integration.py` |
| PDF generation | `test_pdf_report.py` |
| Traffic archive tooling | `test_traffic_collector.py` |
| Repository banner convention | `test_file_banners.py` |

CI (`.github/workflows/test.yml`) rejects files without the project banner,
installs dependencies, runs the unit tests, compiles `src`, builds the image,
and verifies the packaged runtime. CodeQL and Trivy run in separate workflows.

A passing local suite is not proof that a change is safe against a live target.
State what was validated and what was not.

## Policy Changes

Authorization and scope rules live in `src/config/agent-policy.yaml`. A change
to `allowed_tools`, `forbidden_tools`, `target_fields`, or the `authorization`
block alters a security boundary and needs its own justification in the pull
request.

When adding a tool:

- Declare the correct `target_fields` so scope checks cannot be skipped.
- Keep `requires_approval: true` for anything that touches a target.
- Add policy tests for allowed, denied, and out-of-scope calls.

## Pull Requests

The pull request template asks for:

- Summary and related issue.
- Type and implementation details.
- Exact validation commands and results.
- Security and authorization review.
- Documentation and compatibility impact.
- Confirmation of the dual-license contribution terms.

Keep changes focused. Avoid bundling unrelated rewrites.

## Documentation

Operational documentation is maintained in the
[Lophiarch Wiki](https://github.com/amiencoy/lophiarch/wiki). If a change alters
commands, environment variables, policy behavior, or deployment, update the
matching wiki page in the same work. A behavior change with stale docs counts as
an incomplete change.

## Licensing

Lophiarch uses the SPDX expression:

```text
MIT OR Apache-2.0
```

Unless explicitly stated otherwise, intentionally submitted contributions are
provided under the same dual-license terms.

## Security Reports

Do not submit a pull request or issue that publicly reveals an unpatched
Lophiarch vulnerability. Follow the
[Security Policy](https://github.com/amiencoy/lophiarch/security/policy).
