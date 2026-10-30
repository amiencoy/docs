---
sidebar_label: 'Security'
---

# Security and Responsible Use

## Authorized Use Only

Use Lophiarch only against systems you own or are explicitly authorized to
assess. Authorization should define the targets, techniques, time window,
intensity, data handling, and reporting expectations.

Public accessibility is not authorization.

Lophiarch enforces an operator gate and a declared scope at runtime, but that
enforcement is a product safeguard, not a legal one. `/authorize` records your
own acknowledgement inside the bot. It does not create permission.

See [Authorization and Scope](./authorization-and-scope.md).

## Operational Risks

### Docker Socket

The current deployment mounts `/var/run/docker.sock`. Access to this socket is
effectively privileged because a process may create containers with powerful
host access.

Recommended controls:

- Run Lophiarch on a dedicated host or isolated worker node.
- Restrict who can interact with the Telegram bot.
- Keep `TELEGRAM_ALLOWED_CHAT_IDS` minimal and current.
- Do not expose the Docker API over an unauthenticated network endpoint.
- Monitor container creation and image changes.
- Pin and verify production images.
- Rotate secrets if the host or bot is compromised.

### Authorization State

Active authorizations are stored in the bot process and keyed by chat ID. They
are not persisted, not shared between chats, and cleared on restart. This limits
the blast radius of a stale authorization, but it also means the operator must
re-authorize after every restart.

Do not add persistence for authorizations without an explicit expiry and an
audit trail.

### Secrets

Protect:

- `TELEGRAM_BOT_TOKEN`
- `AI_API_KEY`, `GEMINI_API_KEY`, or any provider-specific compatibility
  credential
- Telegram chat identifiers where sensitive
- Scan reports and raw findings

Do not place secrets in Git, issue forms, pull requests, screenshots, or logs.
Use development-only credentials for testing. A local provider can reduce
third-party prompt exposure, but its endpoint and host must still be protected.
If a hosted provider is selected, including an automatic Gemini fallback, review
its retention, logging, and data-use policies before sending sensitive
assessment context.

The fallback path sends the same prompt and tool schemas to Gemini when the
primary provider fails. Leave `GEMINI_API_KEY` empty if that is unacceptable.

### Target Data

Scan output can reveal services, endpoints, software versions, and
vulnerabilities. Treat results as confidential security data. Define retention
and deletion procedures appropriate to the assessment.

Scan memory and generated reports are process-local. Reports written inside a
disposable container are lost unless a volume is mounted.

### Scanner Intensity

- Nmap deep mode scans all ports and uses default scripts.
- Ffuf may generate substantial request volume.
- Nuclei behavior depends on enabled templates.
- Repeated subdomain resolution can affect external services.

Select the least intrusive mode that meets the authorized objective. A tool
being allowed by policy does not make every mode appropriate.

### Parallel Execution

Approved scanners can run at the same time. A multi-tool request therefore
produces more concurrent traffic than a sequential run. On a fragile or
rate-limited target, request one scanner per turn instead of a combined
workflow.

## Reporting Lophiarch Vulnerabilities

Do not open a public issue for a suspected vulnerability in Lophiarch.

Follow the repository
[Security Policy](https://github.com/amiencoy/lophiarch/security/policy).
Use GitHub private vulnerability reporting when available or the fallback
private contact documented in that policy.

Vulnerabilities found in a third-party target are not Lophiarch
vulnerabilities and must follow the target owner's disclosure process.

## Contribution Boundaries

Contributions must not add:

- Credential theft or secret exfiltration.
- Unauthorized persistence or access.
- Destructive payloads.
- Evasion designed to facilitate abuse.
- Hidden network activity.
- Unsafe command construction.
- Policy bypasses, including tools that skip `target_fields` or approval.

Security-sensitive changes should explain their trust boundaries, permissions,
inputs, network behavior, and validation strategy.

## No Bug Bounty

The project security policy does not establish a bug-bounty program or promise
financial compensation.
