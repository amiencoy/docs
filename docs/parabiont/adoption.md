# Adoption

Parabiont v0.1.2 is a reference profile. The supported deployment is a local
loopback pair: one sender, one receiver, one policy.

## Requirements

- Python 3.11 or later
- [Axionorm](/axionorm) installed in the same environment
- An OPA binary installed through Axionorm

The [PARALAX MCP](/paralax) combined installer can set up all three projects in
one environment.

## Install

```bash
git clone --branch v0.1.2 https://github.com/amiencoy/parabiont-protocol.git
cd parabiont-protocol
python -m pip install .
```

## Key Generation

```bash
parabiont keygen .runtime/keys
```

Keep `.runtime` outside any directory an agent can write to.

## Pack a Capsule

```bash
parabiont pack \
  --candidate candidate.json \
  --review review.local.json \
  --policy ../axionorm/examples/technical-review.yaml \
  --opa ../axionorm/.runtime/opa/opa \
  --private-key .runtime/keys/issuer.pem \
  --out .runtime/envelope.json
```

The candidate and review must be prepared and approved first. See the
[Axionorm worked example](/axionorm/examples) for the review step.

## Run a Receiver

```bash
parabiont serve \
  --policy ../axionorm/examples/technical-review.yaml \
  --opa ../axionorm/.runtime/opa/opa \
  --public-key .runtime/keys/issuer.pub.pem \
  --store .runtime/state.sqlite
```

The agent card is published at:

```text
http://127.0.0.1:8787/.well-known/agent-card.json
```

## Send

In another terminal:

```bash
parabiont send .runtime/envelope.json
```

The loopback receiver never invokes a cloud provider.

## Revoke

```bash
parabiont revoke BOND_ID --store .runtime/state.sqlite
```

Start a fresh model session after revocation. Expiry and revocation cannot erase
context already delivered.

## Schema

```bash
parabiont schema
```

This emits the capsule JSON Schema. The same schema is available under
`schemas/capsule.schema.json` in the repository.

## Tests

Tests use a sibling Axionorm checkout. Override its location with
`AXIONORM_POLICY`, and the OPA binary with `OPA_BINARY`.

```bash
python -m pip install pytest
python -m pytest tests -q
```

## What Is Not Supported

- Remote deployment over untrusted networks.
- TLS and remote authentication.
- Distributed revocation.
- Persistent A2A tasks.
- Round-trip reconciliation.
- Claims of A2A 1.0 conformance.
- Claims that ChatGPT or the Gemini consumer app exposes a native A2A endpoint.

The MCP repository includes an A2A HTTP to MCP stdio demo for the supported
local flow.

## Related

- [Axionorm](/axionorm): policy authoring and enforcement.
- [PARALAX MCP](/paralax): the governed MCP gateway and combined installer.
- [Lophiont](https://github.com/amiencoy/lophiont): planned carrier for
  Lophiarch; not implemented here.
