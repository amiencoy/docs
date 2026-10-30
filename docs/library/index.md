---
sidebar_label: 'How to use this library'
slug: /
---

# How to use this library

This site holds the operational documentation for the projects that are far
enough along to deserve it. Everything else is linked from the timeline on the
[library home page](/) with an honest status.

## Reading Paths

### I want to run a reconnaissance tool

Start with [Lophiarch](/lophiarch):

1. [Getting Started](/lophiarch/getting-started) installs the bot and workers.
2. [Authorization and Scope](/lophiarch/authorization-and-scope) explains why
   the first scan gets denied without `/authorize`.
3. [Configuration](/lophiarch/configuration) covers providers, timeouts, and
   the policy file.

### I want to constrain what an agent can do

Start with [Axionorm](/axionorm):

1. [Policy schema](/axionorm/policy-schema) defines the document.
2. [OPA backend](/axionorm/opa) explains how decisions are made.
3. [Worked example](/axionorm/examples) gives you a policy to copy.

### I want to move approved context between agents

Start with [Parabiont Protocol](/parabiont):

1. [Message model](/parabiont/message-model) defines the capsule.
2. [Governance](/parabiont/governance) covers review, leases, and revocation.
3. [Adoption](/parabiont/adoption) runs the reference implementation.

Then read [PARALAX MCP](/paralax) for the gateway that exposes the result to an
agent.

## Status Vocabulary

| Label | Meaning |
| --- | --- |
| Stable | A tagged release that is expected to work as documented. |
| Experimental | A tagged release with known limits; interfaces may change. |
| Pre-alpha | Active work that is not ready for general use. |
| Design | A plan with a repository, not a running implementation. |
| Concept | An idea with no implementation worth documenting yet. |

Documentation for Design and Concept projects is intentionally absent. A page
that describes nothing is worse than a link to the repository.

## Why Some Projects Have No Docs

A documentation page has a cost: it must be checked against the code and kept
current. A project gets one when it has a stable enough surface to describe.

Current gaps:

- **SCRYMR** is pre-alpha.
- **Discord AI Notifier** has a repository and no operator manual yet.
- **Catapult** and **Lophiont** are concept and design stage.

The [timeline](/) links their repositories so you can still inspect the source.

## Corrections

Every page has an edit link that points at the documentation repository. If a
command or a policy description is wrong, fix it there. The site rebuilds from
`main` on every push.
