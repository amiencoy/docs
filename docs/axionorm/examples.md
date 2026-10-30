# Worked Example

This is the sample policy shipped with Axionorm. It is deliberately conservative:
context is limited to technical topics, personal and credential labels are
denied, and workspace writes are off.

```yaml
version: axionorm/v0.1
policy_id: technical-review-v1
audience: gemini-local
purpose: project-development
lease_seconds: 600
context:
  topics: [parabiont, axionorm, paralax, lophiarch]
  kinds: [fact, decision, task, constraint]
  denied_labels: [personal, relationship, debt, finance, health, family, contact, credential, raw-chat]
  max_items: 100
  max_item_chars: 2000
tools:
  - {name: context_read, allow: true, max_bytes: 65536}
  - {name: workspace_list, allow: true, max_bytes: 32768}
  - {name: workspace_read, allow: true, extensions: [.md, .txt, .json, .yaml, .py], max_bytes: 32768}
  - {name: workspace_write, allow: false, extensions: [.md, .txt, .json, .yaml, .py], max_bytes: 32768}
```

## What This Policy Allows

- Four technical topics only.
- Facts, decisions, tasks, and constraints.
- Reading context up to 64 KiB.
- Listing the workspace up to 32 KiB.
- Reading five text-like file extensions up to 32 KiB.
- No writes of any kind.

## Review and Filter

Given `candidate.json`, review the exact items you intend to carry:

```bash
axionorm review candidate.json \
  --approve architecture continuity \
  --out review.local.json
```

Then filter against the policy:

```bash
axionorm filter candidate.json \
  --review review.local.json \
  --policy examples/technical-review.yaml \
  --opa .runtime/opa/opa
```

The output contains only approved, in-policy items plus an audit receipt with
the policy digest and a per-item decision.

## What Gets Rejected

The engine fails closed when:

- An item is missing from the review manifest.
- An approved item was edited after review, so its digest no longer matches.
- An item has a denied label or an unknown field.
- The item kind or topic is outside the policy.
- Duplicate item IDs appear.
- The item count or item length exceeds the configured limit.
- A sensitive pattern matches, including private-key markers, common credential
  words, email addresses, and prompt-injection phrases.
- OPA is missing, times out, or returns an invalid decision.
- No item survives filtering.

## Enabling Writes

`workspace_write` is disabled in the sample for a reason. If an operator enables
it, keep the boundary narrow:

- Keep the extension allowlist explicit.
- Keep `max_bytes` small.
- Prefer create-only artifacts with no overwrite.
- Re-check the operation at the MCP gateway, not only in the policy file.

The policy is authority, not a guarantee that a downstream tool behaves safely.

## Adapting the Example

1. Replace `policy_id`, `audience`, and `purpose` with values for the engagement.
2. Enumerate the topics that are actually relevant. Broad topics defeat the
   filter.
3. Keep `denied_labels` strict. Add labels before loosening topic rules.
4. Start with writes disabled, then enable the smallest possible surface.
5. Add a test that proves an out-of-policy item is rejected.
