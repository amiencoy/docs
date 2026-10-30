# Tools

PARALAX exposes four MCP tools. Each one is checked against policy twice:
during discovery and again during execution.

## `context_read`

Reads the governed state attached through Parabiont.

- Checks policy, expiry, and revocation on every read.
- Returns only what the current bond and policy allow.
- A revoked or expired bond is not served.

## `workspace_list`

Lists exported filenames that were explicitly approved.

- Does not walk arbitrary directories.
- Does not reveal files that were never exported.
- Respects the byte limit declared in policy.

## `workspace_read`

Reads a regular, non-symlink file whose reviewed digest matches.

- Extension must be in the policy allowlist.
- Size must be under `max_bytes`.
- Symlinks are rejected.
- Output is scanned before it reaches the agent.

## `workspace_write`

Optional create-only artifact output.

- Disabled by default.
- No overwrite.
- No execution.
- Extension and size limits still apply.

## Enforcement Model

| Layer | What it does |
| --- | --- |
| Discovery | Denied tools are omitted from the MCP tool list. |
| Execution | The tool is checked again before it runs. |
| Output | Returned text is scanned for sensitive patterns. |
| Filesystem | Path, extension, size, symlink, and digest checks. |

A skill or prompt cannot grant a capability. Skills are advisory. The policy
file and the gateway decide.

## What Is Not Exposed

- No shell execution.
- No package installer.
- No unrestricted browser.
- No arbitrary filesystem access.
- No write tool that can overwrite or execute content.

## Failure Behavior

Denied calls fail; they do not silently return empty data. A missing bond, an
expired lease, a revoked bond, an unapproved path, a digest mismatch, or an
unexpected output match all block the operation.

## Policy Source

Tool names and limits come from the active Axionorm policy. See
[Axionorm policy schema](/axionorm/policy-schema) for the fields and
[the worked example](/axionorm/examples) for a complete document.

## Desktop Integration

The installer generates a Gemini CLI and AionUi configuration. That launcher is
provider-specific even though MCP itself is provider-agnostic. Verify login and
entitlement on the machine; the installer cannot do that for you.
