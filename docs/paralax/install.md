# Install

## Requirements

- Python 3.11 or later
- Git
- Linux, macOS, or WSL2 for the protected filesystem gateway
- Node.js 20 or later and npm only if you want Gemini CLI integration
- AionUi installed separately from its official releases

## Combined Installer

```bash
git clone --branch v0.1.2 https://github.com/amiencoy/paralax-mcp.git
cd paralax-mcp
python3 install.py --directory "$HOME/paralax" --gemini-cli
```

The installer:

- Creates a virtual environment.
- Checks out tagged versions of Axionorm, Parabiont Protocol, and PARALAX MCP.
- Applies tested dependency constraints.
- Installs a checksum-verified OPA binary under `runtime/opa`.

It refuses to overwrite existing repositories. Omit `--gemini-cli` if you
maintain that CLI separately.

## WSL2 Bootstrap

For a first-time WSL2 setup:

```bash
git clone https://github.com/amiencoy/paralax-mcp.git
cd paralax-mcp
chmod +x scripts/bootstrap-wsl.sh
./scripts/bootstrap-wsl.sh
```

The wrapper checks prerequisites, runs the combined installer, verifies the
local A2A-to-MCP demo, and prepares `runtime/candidate.json`.

It does **not** perform a Google login or create private keys. Do those
deliberately.

Set `PARALAX_INSTALL_DIR` to override the install location. It must be a fresh
directory.

## Local Demo

Use a fresh demo directory each time:

```bash
python repos/paralax-mcp/examples/demo.py \
  --directory runtime/demo \
  --policy repos/axionorm/examples/technical-review.yaml \
  --opa runtime/opa/opa
```

The demo starts a real local HTTP A2A receiver and an MCP stdio client. It
verifies that approved state reaches `context_read` while synthetic private and
injected items do not. No Google or OpenAI call occurs.

## Development

Clone the three repositories as siblings and install them into one environment:

```bash
python -m pip install ../axionorm ../parabiont-protocol . pytest
```

Install OPA, then run:

```bash
python -m pytest tests -q
```

`AXIONORM_POLICY` and `OPA_BINARY` override sibling defaults.

## Further Reading

- [Installation and round-trip flow](https://github.com/amiencoy/paralax-mcp/blob/main/docs/INSTALLATION.md)
- [Desktop setup and handoff](https://github.com/amiencoy/paralax-mcp/blob/main/docs/DESKTOP.md)
- [Architecture and limits](https://github.com/amiencoy/paralax-mcp/blob/main/docs/ARCHITECTURE.md)
