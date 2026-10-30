---
sidebar_label: 'Authorization and Scope'
---

# Authorization and Scope

Lophiarch does not start an active scanner because a model asked for it. Every
active tool call passes through a runtime policy check before it reaches MCP.
Prompt instructions are not a security boundary.

## Operator Gate

Only chat IDs listed in `TELEGRAM_ALLOWED_CHAT_IDS` can use the bot. Any other
chat receives `[REFUSED] | This chat is not configured as an operator.` and no
agent call is made.

`TELEGRAM_ALLOWED_CHAT_IDS` accepts a comma-separated list. `TELEGRAM_CHAT_ID`
is still read as a fallback for older deployments.

## Declaring Scope

An authorization is created per Telegram chat with `/authorize`:

```text
/authorize example.com ticket=ENG-001
```

Multiple targets can be supplied in one command, separated by commas or spaces:

```text
/authorize example.com, 192.0.2.0/24 ticket=ENG-001
```

Check the active authorization with `/scope` and clear it with `/revoke`.

```text
/scope
/revoke
```

A typical engagement therefore starts with authorization, not with a scan
request:

```text
/authorize example.com ticket=ENG-001
scan example.com with nmap, ffuf and nuclei, then create a PDF report
/revoke
```

## Scope Matching Rules

A target is inside scope when:

- **Hostnames** match the authorized entry exactly or end with `.` plus that
  entry. Authorizing `example.com` also allows `api.example.com`, but not
  `notexample.com`.
- **IP addresses** match the authorized address exactly or fall inside an
  authorized CIDR range.
- URLs are reduced to their hostname before comparison, and entries are
  lowercased with trailing dots removed.

## Per-Chat, In-Memory State

Authorizations live in the running bot process, keyed by chat ID. They are not
written to disk and are not shared between chats. Restarting the container
clears every authorization, so `/scope` will report no active authorization
until `/authorize` is issued again.

Treat that as a deliberate safety property, not a bug. If you restart the bot,
re-authorize the engagement explicitly.

## Policy File

Runtime rules are declared in `src/config/agent-policy.yaml`:

```yaml
authorization:
  default_deny: true
  require_declared_scope: true

allowed_tools:
  - name: execute_nmap
    requires_approval: true
    target_fields: [target]
```

- `default_deny` denies any tool that is not in `allowed_tools`.
- `require_declared_scope` refuses active tools until `/authorize` has set a
  non-empty scope.
- `requires_approval` refuses the tool until an `AuthorizationContext` with
  `approved=true` exists for that chat.
- `target_fields` names the arguments that are checked against the scope. An
  active tool with no target argument fails with `TARGET_REQUIRED`.
- `forbidden_tools` is a hard deny list. The default file lists exploitation,
  persistence, credential dumping, and destructive testing.

`create_pdf_report` is the only allowed tool with `requires_approval: false`,
because it reads existing scan memory and starts nothing.

## Denial Codes

Denied calls are reported in Telegram as
`[DENIED] | <tool>: <CODE> - <reason>`.

| Code | Meaning | Fix |
| --- | --- | --- |
| `APPROVAL_REQUIRED` | No authorization exists for this chat. | Run `/authorize` first. |
| `SCOPE_REQUIRED` | An authorization exists but its scope is empty. | Authorize at least one target. |
| `OUT_OF_SCOPE` | The tool target is not covered by the authorized scope. | Authorize the exact host, domain, or CIDR. |
| `TARGET_REQUIRED` | The tool was called without a target argument. | Restate the request with a concrete target. |
| `TOOL_NOT_ALLOWED` | The tool is missing from `allowed_tools`. | Extend the policy deliberately, then review it. |
| `TOOL_FORBIDDEN` | The tool is on the `forbidden_tools` list. | Not supported. Do not work around it. |

## What Authorization Does Not Do

`/authorize` is an operator acknowledgement inside Lophiarch. It is not legal
permission, not a contract, and not evidence that the target owner agreed.

- It does not make a scan less intrusive. Nmap `deep`, Ffuf, and Nuclei can
  still affect the target.
- It does not replace a signed engagement scope or rules of engagement.
- It does not cover systems reached indirectly by a scan.

See [Security and Responsible Use](./security.md) for the
operational boundaries and [Configuration](./configuration.md) for the policy
fields.
