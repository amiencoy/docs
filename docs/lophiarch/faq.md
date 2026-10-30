---
sidebar_label: 'FAQ'
---

# Frequently Asked Questions

## Is Lophiarch an exploitation framework?

No. Its current scope is authorized reconnaissance, scanner orchestration, and
reporting. Contributions that add destructive or unauthorized behavior are out
of scope, and the shipped policy file denies exploitation-style tools by name.

## Does a public target mean I can scan it?

No. Public accessibility is not authorization. Obtain explicit permission and
follow the defined assessment scope.

## Why was my scan denied?

Active tools require an operator authorization with a declared scope. Run
`/authorize <target> ticket=<id>` before scanning. The denial code tells you
which check failed; see [Authorization and Scope](./authorization-and-scope.md).

## Why did authorization disappear after a restart?

Authorization state is intentionally in memory and per chat. Restarting the bot
or the pod clears it. Re-authorize the engagement and check `/scope`.

## Can I skip authorization for a trusted target?

Not without changing `src/config/agent-policy.yaml`, which is a security
boundary change. Do not disable it casually; the policy exists so a prompt
injection or a confused model cannot launch a scanner on its own.

## Why does Lophiarch need the Docker socket?

The main bot uses Docker-out-of-Docker to start disposable scanner containers on
the host Docker daemon. This keeps scanner dependencies out of the main image,
but creates a powerful security boundary.

## Does Lophiarch work on a containerd-only Kubernetes cluster?

Not with the current Helm chart by default. The Deployment mounts
`/var/run/docker.sock` and expects a compatible Docker daemon.

## Are scanner worker images published to GHCR?

The current GitHub Actions workflow publishes the main Lophiarch image.
Nmap, Ffuf, and Nuclei worker images are currently built separately.

## Do multiple requested scanners run one after another?

No. Approved scanner calls run concurrently, and the PDF report waits until the
scanner batch finishes. See [Architecture Overview](./architecture.md).

## Where are scan results stored?

The MCP server keeps current scan results in process memory. PDF files are
written to `generated_reports/`. A successful PDF generation clears the
in-memory scan data.

## Why did a scanner return no findings?

An empty result can be caused by target formatting, DNS, connectivity,
authorization-scoped firewalls, scanner behavior, rate limits, or genuinely
empty findings. See [Troubleshooting](./troubleshooting.md).

## Can I add another scanner?

Yes, when it has a legitimate authorized reconnaissance or defensive-security
use case. Open the **Scanner or tool integration** issue form first, and declare
its target fields and approval requirement in the policy.

## Is the test suite complete?

It covers policy decisions, agent planning, Telegram authorization, provider
selection and fallback, MCP transport, PDF generation, and repository
conventions. It is not a substitute for testing against an authorized lab
target.

## Which license applies?

You may use Lophiarch under either the MIT License or Apache License 2.0:
`MIT OR Apache-2.0`.

## Does sponsorship include support or consulting?

No. GitHub sponsorship supports open-source maintenance. Guaranteed support,
custom integrations, deployment, and consulting are separate commercial
services.

## How do I report a Lophiarch vulnerability?

Use the repository's private vulnerability reporting flow when available or
follow the email instructions in the
[Security Policy](https://github.com/amiencoy/lophiarch/security/policy).
Do not open a public issue.
