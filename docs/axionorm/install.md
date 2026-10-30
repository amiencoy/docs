# Install

## Requirements

- Python 3.11 or later
- Git
- A virtual environment (recommended)
- A supported platform for the OPA binary you install

## Install the Package

```bash
git clone --branch v0.1.0 https://github.com/amiencoy/axionorm.git
cd axionorm
python3 -m venv .venv
. .venv/bin/activate
python -m pip install .
```

## Install OPA

```bash
axionorm install-opa --directory .runtime/opa
```

The installer downloads a pinned OPA release, verifies its SHA-256 checksum from
`opa-lock.json`, and installs it locally. It does not use `sudo`, does not write
to a global PATH, and reuses a matching binary if one already exists.

The lock covers:

| OS | Architectures |
| --- | --- |
| Linux | AMD64, ARM64 |
| macOS | AMD64, ARM64 |
| Windows | AMD64 |

To use an existing OPA binary instead, set `OPA_BINARY` to its path when running
the engine or tests.

## Verify the Schema

```bash
axionorm schema policy
```

This emits the JSON Schema for a policy document. The same schema is available
in the repository under `schemas/`.

## Run the Tests

```bash
python -m pip install pytest
python -m pytest tests -q
```

Tests require OPA to be installed. `OPA_BINARY` overrides the default location.

## Command Summary

| Command | Purpose |
| --- | --- |
| `axionorm install-opa --directory <dir>` | Install the pinned OPA binary locally. |
| `axionorm schema policy` | Print the policy JSON Schema. |
| `axionorm review <candidate> --approve <ids> --out <file>` | Record digest-bound approval for selected items. |
| `axionorm filter <candidate> --review <file> --policy <yaml> --opa <binary>` | Filter context and emit an audit receipt. |

## What Installation Does Not Do

- It does not install system packages or modify global PATH entries.
- It does not trust a YAML file to run arbitrary install commands.
- It does not enable tool writes. `workspace_write` stays disabled unless a
  policy explicitly allows it.
