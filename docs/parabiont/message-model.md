# Message Model

Parabiont carries one signed envelope per transfer. The envelope contains a
capsule and a detached signature.

```json
{
  "capsule": {
    "version": "parabiont-context/v0.1",
    "bond_id": "5e2a1f3c-9b7d-4a1e-8f2c-3d4b5a6c7d8e",
    "audience": "gemini-local",
    "purpose": "project-development",
    "issued_at": 1790000000,
    "expires_at": 1790000600,
    "policy_digest": "<64 hex chars>",
    "state": [
      {
        "id": "product-lophiarch",
        "kind": "fact",
        "topic": "positioning",
        "text": "Lophiarch is a policy-gated reconnaissance tool."
      }
    ]
  },
  "signature": "<base64 Ed25519 signature>"
}
```

## Envelope

The envelope has exactly two keys: `capsule` and `signature`. Any extra key is
rejected. The signature is Ed25519 over the canonical JSON of the capsule.

Canonical JSON means sorted keys, compact separators, no ASCII escaping, and
UTF-8 encoding. Both sides must produce the same bytes or verification fails.

## Capsule Fields

| Field | Type | Description |
| --- | --- | --- |
| `version` | string | Must be `parabiont-context/v0.1`. |
| `bond_id` | UUID string | Identifies this attachment; lowercase hex with hyphens. |
| `audience` | string | Lowercase identifier of the intended receiver. |
| `purpose` | string | Lowercase identifier of the engagement or task. |
| `issued_at` | integer | Unix seconds when the capsule was packed. |
| `expires_at` | integer | Unix seconds when the lease ends. |
| `policy_digest` | string | SHA-256 of the canonical policy document. |
| `state` | array | 1–500 approved context items. |

## State Items

Each item is the minimal approved projection of a candidate item:

| Field | Constraints |
| --- | --- |
| `id` | Letters, digits, hyphens; 1–64 chars. |
| `kind` | `fact`, `decision`, `task`, or `constraint`. |
| `topic` | Lowercase letters, digits, hyphens; 1–64 chars. |
| `text` | 1–10000 chars. |

Labels are intentionally not carried. They were used during filtering, not as
part of the payload. A receiver re-evaluates the item under its own policy with
the technical label applied.

## Verification Rules

A receiver rejects the envelope when:

- The envelope has keys other than `capsule` and `signature`.
- The capsule fails schema validation.
- The signature does not verify against the issuer's public key.
- The current time is outside `[issued_at, expires_at)`.
- The lease is longer than the receiver's configured `lease_seconds`.
- `audience`, `purpose`, or `policy_digest` does not match the receiver policy.
- Any item fails the receiver's own policy re-evaluation.
- The re-evaluated state differs from the signed state.

Re-evaluation matters: the signature authenticates that an operator reviewed
the content, not that the receiver's policy still allows it.

## Bond Storage

The receiver records the bond in SQLite. Revocation is local state: a revoked
bond blocks future reads and re-delivery through that receiver. It cannot
un-deliver content that a model has already consumed.
