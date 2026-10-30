---
sidebar_label: 'Scanners and Tools'
---

# Scanner and Tool Integrations

## Current Tool Surface

| MCP tool | Backend | Purpose |
| --- | --- | --- |
| `execute_subdomain_recon` | Subfinder, OTX fallback, dnsx | Enumerate and filter active subdomains. |
| `execute_nmap` | Nmap | Discover open ports and services. |
| `execute_nuclei` | Nuclei | Run template-based vulnerability checks. |
| `execute_ffuf` | Ffuf and SecLists | Discover web content and endpoints. |
| `create_pdf_report` | ReportLab | Convert accumulated results into a PDF. |

All four scanner tools are declared in `src/config/agent-policy.yaml` with
`requires_approval: true`, and their target argument is checked against the
active `/authorize` scope. `create_pdf_report` starts no scan process, so it does
not require approval, but it still needs scan memory produced by an authorized
run. See [Authorization and Scope](./authorization-and-scope.md).

## Subdomain Pipeline

1. Subfinder enumerates candidate subdomains.
2. If Subfinder returns no results, the MCP server queries AlienVault OTX.
3. dnsx filters the candidate list for resolvable hosts.
4. Active results are stored in scan memory.

## Nmap

Nmap normalizes URLs to hostnames and returns parsed XML findings. Available
modes are `quick`, `default`, and `deep`.

The `deep` mode can be slow and intrusive because it scans all ports and runs
default scripts. Use it only when explicitly authorized.

## Nuclei

Nuclei receives a target and emits JSON Lines. Lophiarch parses valid JSON
records and stores them for reporting.

Template behavior changes as Nuclei templates evolve. Pin versions for
reproducible production use.

## Ffuf

Ffuf appends `FUZZ` to the selected base URL, uses a bundled wordlist, and
parses JSON output. `deep` is the tool default when no mode is supplied; use
`quick` or `default` for the lighter wordlist. Current concurrency is configured
in the engine command. Review rate and target impact before testing production
services.

## Adding an Integration

Open the **Scanner or tool integration** issue form and document:

- Official upstream source and license.
- The capability gap it fills.
- MCP inputs and structured outputs.
- Container image source, pinning, and update plan.
- Required privileges, network access, and secrets.
- Rate limiting and destructive capabilities.
- Tests, reporting changes, and documentation.

An integration should:

- Support authorized reconnaissance or defensive security.
- Prefer disposable, isolated execution.
- Avoid shell interpolation and validate arguments.
- Declare `target_fields` and `requires_approval` in `src/config/agent-policy.yaml`.
- Return predictable data suitable for reporting.
- Avoid introducing exploitation or destructive behavior.
- Preserve the project's dual-license and upstream licensing obligations.

See the [Contributing Guidelines](https://github.com/amiencoy/lophiarch/blob/main/CONTRIBUTING.md)
before implementation.
