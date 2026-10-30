# Policy Schema

A policy is a strict YAML document. Unknown fields are rejected, and types are
checked without coercion.

## Top-Level Fields

| Field | Type | Required | Constraints |
| --- | --- | --- | --- |
| `version` | string | Yes | Must be `axionorm/v0.1`. |
| `policy_id` | string | Yes | Lowercase letters, digits, and hyphens; 1–64 chars. |
| `audience` | string | Yes | Lowercase letters, digits, and hyphens; 1–64 chars. |
| `purpose` | string | Yes | Lowercase letters, digits, and hyphens; 1–64 chars. |
| `lease_seconds` | integer | No | 30–3600; defaults to 600. |
| `context` | object | Yes | See below. |
| `tools` | array | Yes | See below. |

## `context`

Controls what may leave a session.

| Field | Type | Required | Constraints |
| --- | --- | --- | --- |
| `topics` | string[] | Yes | 1–30 entries. |
| `kinds` | string[] | Yes | Subset of `fact`, `decision`, `task`, `constraint`. |
| `denied_labels` | string[] | Yes | At least one label. |
| `max_items` | integer | No | 1–500; defaults to 100. |
| `max_item_chars` | integer | No | 1–10000; defaults to 2000. |

An item is eligible only when its `kind` is in the allowed kinds, its topic is
allowed, and none of its labels match the denied list.

## `tools`

Each entry declares one tool boundary.

| Field | Type | Required | Constraints |
| --- | --- | --- | --- |
| `name` | string | Yes | `workspace_list`, `workspace_read`, `workspace_write`, or `context_read`. |
| `allow` | boolean | No | Defaults to `false`. |
| `extensions` | string[] | No | Allowed file extensions, for workspace tools. |
| `max_bytes` | integer | No | 1–1048576; defaults to 32768. |

Duplicate tool names are rejected by the engine at load time. A tool that is not
declared is not allowed; there is no implicit allowlist.

## Candidate Format

The context candidate is JSON, not YAML:

```json
{
  "version": "parabiont-candidate/v0.1",
  "items": [
    {
      "id": "product-lophiarch",
      "kind": "fact",
      "topic": "positioning",
      "labels": ["technical"],
      "text": "Lophiarch is a policy-gated reconnaissance tool."
    }
  ]
}
```

| Field | Constraints |
| --- | --- |
| `id` | Letters, digits, and hyphens; 1–64 chars; unique in the document. |
| `kind` | `fact`, `decision`, `task`, or `constraint`. |
| `topic` | Lowercase letters, digits, and hyphens; 1–64 chars. |
| `labels` | 1–20 entries. |
| `text` | 1–10000 chars. |

## Review Manifest

Approval is a separate file:

```json
{
  "version": "axionorm-review/v0.1",
  "approved": {
    "product-lophiarch": "<sha256-of-canonical-item>"
  }
}
```

The digest is SHA-256 over canonical JSON: sorted keys, compact separators, and
UTF-8 encoding. If the item changes, the digest no longer matches and the item is
not approved.

An invalid manifest shape, a duplicate ID, an exceeded item limit, or an empty
result raises `PolicyDenied`. None of these produce a partial success.

## Manifest Rules

- `version` and `approved` are the only top-level keys.
- `version` must be `axionorm-review/v0.1`.
- `approved` maps item IDs to digests.
- An item without a matching digest is not reviewed.

## Next

- [OPA backend](./opa.md)
- [Worked example](./examples.md)
