# Return Path

Context that flows back from a model is not automatically trusted. PARALAX keeps
model-written deltas quarantined until an operator validates and reviews them.

## The Rule

**No automatic memory promotion.**

A review bundle is evidence, not an approval. It never issues a capsule, changes
a bond, or promotes memory on its own.

## 1. Validate a Delta

```bash
paralax-delta validate artifacts/context-delta-YYYYMMDD-HHMMSS.json
```

Validation checks the delta shape and provenance before anything else touches
it.

## 2. Create a Review Bundle

```bash
paralax-delta review artifacts/context-delta-YYYYMMDD-HHMMSS.json \
  --policy runtime/policy.yaml \
  --opa runtime/opa/opa \
  --output artifacts/review-YYYYMMDD-HHMMSS \
  --approve item-1 item-2
```

The bundle contains:

- The byte-preserved source delta.
- An Axionorm candidate built from the delta.
- A provenance mapping back to the original artifact.
- A digest review for each approved item.
- Per-item policy diagnostics from OPA.

## 3. Review the Bundle

Inspect the candidate, the provenance map, and the diagnostics. If an item is
rejected, fix the source or leave it out. Do not edit the candidate in place and
pretend the digest still matches.

## `--approve-all`

`--approve-all` exists for operator-reviewed test fixtures. It is not a shortcut
for production use. If a workflow depends on it, the workflow has no review.

## Labels

`--add-label technical` records an explicit adapter transformation when an
active Axionorm v0.1 policy requires that label. It is recorded, not hidden.

## What the Bundle Does Not Do

- It does not sign anything.
- It does not create a bond.
- It does not modify the store.
- It does not promote memory.
- It does not bypass the next policy evaluation.

A new capsule still needs a separate operator review and pack step.

## Provenance

The source delta is preserved byte for byte. That makes it possible to compare
what the model proposed with what the operator eventually approved, without
trusting a rewritten summary.

## Tests

The suite includes a real MCP stdio round trip through `context_read`,
`workspace_write`, delta validation, provenance preservation, Axionorm review,
and OPA diagnostics. Fixtures contain no personal history or credentials.

See the repository's
[development report](https://github.com/amiencoy/paralax-mcp/blob/main/docs/DEVELOPMENT-REPORT.md)
for the verified flow and the remaining gaps.
