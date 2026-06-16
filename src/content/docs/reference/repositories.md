---
title: Repository inventory
description: Every repo in the patternyard org and what it is.
sidebar:
  order: 1
---

The authoritative list of repositories in the
[`patternyard` org](https://github.com/patternyard). Deployed projects are marked; the
rest are build-time libraries.

## Deployed

| Repo | Project | Subdomain |
|---|---|---|
| `PatternYard-Home` | `patternyard-home` | apex + `www` |
| `patternyard-studio` | `patternyard-studio` | `studio.` |
| `PatternYard-BackendApi` | `patternyard-backend` | `api.` |
| `PatternYard-Packager` | `patternyard-packager` | `packager.` |
| `PatternYard-ExtensionsGallery` | `patternyard-extensions` | `extensions.` |
| `PatternYard-Docs` | `patternyard-docs` | `docs.` |

The `library.` content service is deployed but has **no source repo** — see
[data & storage](/architecture/data-flow/).

## Build-time libraries

| Repo | Role |
|---|---|
| `PatternYard-Vm` | Project virtual machine |
| `PatternYard-Blocks` | Block definitions / Blockly fork |
| `PatternYard-Render` | Stage renderer |
| `patternyard-svg-renderer` | SVG renderer (unhardcoded stage size) |
| `patternyard-render-fonts` | Fonts for SVG rendering |
| `PatternYard-Paint` | Costume paint editor |
| `PatternYard-Audio` | Web Audio engine |
| `PatternYard-Storage` | Project/asset load + store |
| `PatternYard-Parser` | `scratch-parser` fork |
| `PatternYard-SvelteUI` | Shared Svelte components |
| `PatternYard-MarkDown` | Markdown parser/compiler |
| `PatternYard-MarkDownNew` | Markdown formatting helpers (marked wrapper) |
| `PatternYard-ObjectLibraries` | Public-domain costumes, sounds, library assets |
| `PatternYard-ApiModule` | Internal dev helper (WIP) |

:::note[Naming]
Repo casing is inconsistent (`PatternYard-*` vs `patternyard-*`) — a migration artifact.
The Vercel project slugs are consistently lowercase `patternyard-*`. Use the table, not
guesswork, when scripting.
:::

## Provenance

Most build-time libraries are **forks** of upstream Scratch/TurboWarp/PenguinMod engine
packages, migrated from the `wycats` account into the `patternyard` org and renamed.
They are kept mergeable on a `wycats-main` work branch so upstream fixes can still be
pulled. Only the first-party identity layer is rebranded — engine internals keep their
upstream names to avoid merge pain.
