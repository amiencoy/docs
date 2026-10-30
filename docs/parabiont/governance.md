# Governance

Parabiont is a governance protocol first and a transport second. The signature
proves origin; the review and policy prove what was allowed to leave.

## Three Controls

### 1. Operator review before pack

A candidate is not sent because an agent proposed it. An operator reviews the
specific item IDs and writes an approval manifest. Approval records the SHA-256
digest of each item.

Editing an item after approval invalidates it. That prevents "review once, ship
anything later" behavior.

### 2. Policy evaluation before signing

Axionorm evaluates every item through OPA. Rejected content never enters the
capsule, so the receiver cannot read what the sender already dropped.

The filtered result and an audit receipt are produced together. The policy
digest travels in the capsule so the receiver can detect a policy mismatch.

### 3. Receiver re-evaluation

The receiver does not trust the sender's filter. It verifies the signature,
checks the lease and policy binding, re-runs its own policy against the state,
and only then exposes the bond through MCP.

A receiver that cannot evaluate fails closed.

## Leases and Expiry

- `lease_seconds` is declared by policy and bounded to 30–3600 seconds.
- The capsule is valid only while `issued_at <= now < expires_at`.
- The receiver also rejects a lease longer than its own policy allows.
- There is no renewal mechanism in v0.1.2. Issue a new capsule instead.

## Revocation

```bash
parabiont revoke BOND_ID --store .runtime/state.sqlite
```

Revocation blocks future reads and re-delivery through that receiver. It does
not remove context from a model that already received it.

Operational rule: start a fresh model session after revoking a bond. Do not
assume the model forgot.

## Keys

```bash
parabiont keygen .runtime/keys
```

This creates `issuer.pem` and `issuer.pub.pem` with restrictive permissions and
exclusive creation, so an existing trust root is not overwritten.

Keep private keys, policies, review manifests, and state databases outside
model-writable paths. A model that can rewrite its own policy is not governed.

## Replay Protection

The bond ID, issue time, and expiry give the receiver enough state to reject a
replayed envelope. The receiver records the bond; a revoked or expired bond is
not re-exposed.

## Failure Behavior

The reference implementation denies on:

- Invalid envelope shape or schema.
- Signature failure.
- Expired or over-long lease.
- Audience, purpose, or policy digest mismatch.
- Receiver policy rejection of any item.
- A re-evaluated state that differs from the signed state.
- Missing or invalid store state.

None of these degrade into a partial delivery.

## What This Does Not Solve

- A reviewer approving mislabeled sensitive prose.
- A compromised operator key.
- Content already consumed by a model.
- Remote multi-tenant deployment, TLS termination, or distributed revocation.
- Persistent A2A task lifecycle and reconciliation.

Treat those as explicit non-goals of v0.1.2, not as features to assume.
