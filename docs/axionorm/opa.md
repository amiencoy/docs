# OPA Backend

Axionorm authors and enforces policy. OPA evaluates the normalized decision.
They are complementary layers, not two engines competing for the same job.

| Concern | Axionorm | OPA |
| --- | --- | --- |
| Authoring | Validates YAML with a strict, versioned schema | Evaluates packaged Rego against normalized JSON |
| Context | Checks digests and sensitive patterns; builds filtered output | Decides allow or deny per item |
| Tools | Validates paths and content; blocks at the MCP boundary | Decides allow or deny for the operation, extension, size, and scope |
| Lifecycle | Binds the policy digest to a Parabiont lease | Evaluates current rules without handling provider state |
| Failure | Blocks when OPA times out, fails, or returns an unexpected result | No permissive fallback |

## Decision Paths

Axionorm asks OPA two kinds of questions.

### `action=context`

Input includes the item, whether its reviewed digest matches, and whether a
sensitive-pattern check matched. The result is a boolean for that item.

```json
{
  "action": "context",
  "item": {"id": "item-1", "kind": "fact", "topic": "architecture", "text": "..."},
  "reviewed": true,
  "sensitive": false
}
```

### `action=tool`

Input includes the tool name, extension, byte size, and whether the scope is
valid.

```json
{
  "action": "tool",
  "tool": "workspace_read",
  "extension": ".md",
  "bytes": 4096,
  "scope_valid": true
}
```

## Execution Model

- OPA runs as a local subprocess per decision.
- The policy document is included in the input payload.
- Evaluation has a five-second timeout.
- A non-zero exit, timeout, invalid JSON, or unexpected result shape raises
  `PolicyDenied`.
- The binary path is resolved at engine construction. A missing binary is a
  startup failure, not a runtime surprise.

There is no public OPA API in this implementation. A future high-throughput
deployment can use a localhost sidecar or an embedded/Wasm evaluator with the
same contract.

## What OPA Does Not Do

- It does not infer private facts or understand natural-language relevance.
- It does not remove text from an item.
- It does not install tools or manage provider accounts.
- It does not enforce anything after context has been delivered to a model.

Axionorm performs selection and enforcement around the decision.

## OPA Version and Integrity

`axionorm install-opa` pins OPA 1.19.1. SHA-256 digests in `opa-lock.json` come
from official release assets, and an existing binary with a matching digest is
reused.

Supported combinations cover Linux AMD64/ARM64, macOS AMD64/ARM64, and Windows
AMD64.

## Operational Notes

- Keep the OPA binary, policy files, and review manifests outside
  model-writable paths.
- Pin the OPA version in CI and production.
- Treat a policy change as a security change: review it, test it, and restart
  the process that loaded it.
- A permissive Rego rule is still a policy decision. Axionorm does not
  second-guess an allow; it only fails closed when the decision cannot be
  trusted.

Reference: [Open Policy Agent documentation](https://www.openpolicyagent.org/docs)
