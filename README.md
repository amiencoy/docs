# Draxis Digital Docs

The documentation library for Draxis Digital projects, built with Docusaurus and
deployed to GitHub Pages by GitHub Actions.

## What Lives Here

| Route | Project | Source |
| --- | --- | --- |
| `/lophiarch` | Lophiarch | Ported from the GitHub Wiki and checked against v2.2.2. |
| `/axionorm` | Axionorm | Checked against v0.1.0. |
| `/parabiont` | Parabiont Protocol | Checked against v0.1.2. |
| `/paralax` | PARALAX MCP | Checked against v0.1.2. |
| `/` | Library hub | Timeline of every tracked project, documented or not. |

Lophiarch, Axionorm, Parabiont Protocol, and PARALAX MCP form one stack: a
policy-gated tool, the policy layer, the context carrier, and the MCP gateway.

## Stack

- Docusaurus 3, with one documentation instance per project so each can be
  versioned on its own release cadence.
- Offline search through `@easyops-cn/docusaurus-search-local`; no external
  search account or API key.
- A React landing page for the project timeline.
- Markdown kept in Git and reviewed like code.

## Local Development

Requires Node.js 20 or later.

```bash
npm install
npm run start
```

Build and preview the production output:

```bash
npm run build
npm run serve
```

## Deployment

`.github/workflows/deploy.yml` builds on every push to `main` and deploys the
`build` directory to GitHub Pages. The workflow enables Pages on the first run
through `actions/configure-pages`.

The site is served from `https://amiencoy.github.io/docs/`. The `baseUrl` in
`docusaurus.config.js` matches the repository name. If the repository is ever
renamed or a custom domain is attached, update `url` and `baseUrl` together.

## Adding a Project

1. Add `docs/<project>/index.md` and any supporting pages.
2. Add a sidebar file at `sidebars.<project>.js`.
3. Register a new `@docusaurus/plugin-content-docs` instance in
   `docusaurus.config.js` with a unique `id` and `routeBasePath`.
4. Add the project to the search plugin's `docsRouteBasePath` and `docsDir`.
5. Add it to `src/components/ProjectTimeline.js`, with `docs` only if a real
   documentation section exists.

## Adding a Version

Each project is a separate docs instance, so versioning is independent:

```bash
npm run docusaurus docs:version:lophiarch 2.2.2
```

The command name is `docs:version:<plugin-id>`. Do not version a project before
its public interface is stable enough to keep an old copy honest.

## Writing Rules

- Commands, environment variables, and policy behavior must be checked against
  the tagged source, not inferred.
- Every claim about a security boundary names the file or mechanism that
  enforces it.
- Mark experimental status explicitly. Do not describe planned behavior as
  shipped.
- Keep licensing statements accurate. Several projects have not selected a
  license yet.
