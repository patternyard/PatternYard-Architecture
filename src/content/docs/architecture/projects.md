---
title: Projects & repositories
description: What each deployed project is, and how the ~20 supporting repos relate to them.
sidebar:
  order: 1
---

PatternYard is split across roughly twenty repositories in the
[`patternyard` GitHub org](https://github.com/patternyard). Only a handful are *deployed
projects*; the rest are libraries consumed at build time by the editor and packager.

## Deployed projects

These are the things that actually run and have a URL.

| Surface | Repo | Vercel project | Subdomain |
|---|---|---|---|
| Home | `PatternYard-Home` | `patternyard-home` | apex + `www` |
| Editor | `patternyard-studio` | `patternyard-studio` | `studio.` |
| Backend API | `PatternYard-BackendApi` | `patternyard-backend` | `api.` |
| Packager | `PatternYard-Packager` | `patternyard-packager` | `packager.` |
| Extensions | `PatternYard-ExtensionsGallery` | `patternyard-extensions` | `extensions.` |
| Docs (product) | `PatternYard-Docs` | `patternyard-docs` | `docs.` |
| Library / assets | _(no source repo — content service)_ | `patternyard-library` | `library.` |

```d2
direction: down

editor: patternyard-studio\n(the editor) {style.fill: "#dbeafe"}

editor -> home: PatternYard-Home
editor -> backend: PatternYard-BackendApi
editor -> ext: PatternYard-ExtensionsGallery
editor -> docs: PatternYard-Docs

libs: Build-time libraries {
  style.fill: "#e7f5e1"
  vm: PatternYard-Vm
  blocks: PatternYard-Blocks
  render: PatternYard-Render
  svgr: patternyard-svg-renderer
  paint: PatternYard-Paint
  audio: PatternYard-Audio
  storage: PatternYard-Storage
  svelteui: PatternYard-SvelteUI
}

editor -> libs: bundled at build
home -> libs.svelteui: shared components
```

## Supporting libraries

These are **not deployed**. They are npm-style packages the editor (and sometimes home)
pull in at build time. Most are forks of upstream Scratch/TurboWarp engine packages,
kept mergeable on a `wycats-main` work branch so we can still take upstream fixes.

| Repo | Role |
|---|---|
| `PatternYard-Vm` | The virtual machine that runs projects |
| `PatternYard-Blocks` | The block definitions / Blockly fork |
| `PatternYard-Render` | The stage renderer |
| `patternyard-svg-renderer` | SVG renderer (unhardcoded stage size) |
| `patternyard-render-fonts` | Fonts for SVG rendering |
| `PatternYard-Paint` | The costume paint editor |
| `PatternYard-Audio` | Web Audio engine |
| `PatternYard-Storage` | Project/asset load + store |
| `PatternYard-Parser` | `scratch-parser` fork |
| `PatternYard-SvelteUI` | Shared Svelte components (Home + others) |
| `PatternYard-MarkDown` / `PatternYard-MarkDownNew` | Markdown parsing/formatting |
| `PatternYard-ObjectLibraries` | Public-domain costumes, sounds, library assets |
| `PatternYard-ApiModule` | Internal dev helper (WIP, not supported externally) |

:::tip[Fork discipline]
Most engine libraries are upstream forks. Rebrand only the first-party identity layer;
do **not** wholesale-rename "PenguinMod" inside engine code, or merges from upstream
become painful. See the migration notes for the full rationale.
:::

## The two content services with no repo

`library.` and the asset CDN are **not code** — they serve community asset blobs
(costumes, sounds, backpack items, project assets). "Self-hosting" them means standing
up storage plus a thin serving route, backed by Vercel Blob with mirror-on-demand
(proxy + cache on first miss) rather than bulk-copying gigabytes. See
[data & storage](/architecture/data-flow/).
