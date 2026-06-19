---
title: Success criteria
description: The non-negotiable goal of the PatternYard fork — full runtime independence from penguinmod.com.
---

This is the single most important rule for the whole PatternYard project. Read it
before making any decision about hosts, defaults, environment variables, or
"fallbacks."

## The goal: full runtime independence from penguinmod.com

PatternYard is a complete fork of the PenguinMod infrastructure. The entire point
of the fork is that **nothing PatternYard needs at runtime points at
`*.penguinmod.com`** — not the asset CDN, not the project host, not the library,
not the extensions host, not the API, not the docs.

Every deployed surface, and every host an app talks to while running, must resolve
to **patternyard.dev** (or another PatternYard-owned origin).

## How to treat a remaining upstream dependency

If you find an app that still reaches `*.penguinmod.com` at runtime, that is a
**bug**. Close it by standing up — or pointing at — the PatternYard equivalent.

- **Do** make every PatternYard *deployment* resolve each host to its
  `patternyard.dev` equivalent — through configuration (env vars) and the
  runtime defaults baked into PatternYard-owned config, not by rewriting upstream
  defaults in tracked engine source (see the two axes below).
- **Do** stand up the missing PatternYard service if the equivalent host does not
  serve yet.
- **Do not** "fall back" to the upstream host when an environment variable is
  unset. There is no upstream fallback.
- **Do not** delete a `patternyard.dev` expectation just because it 404s today —
  that is infrastructure to build, not scaffolding to remove.

## Two axes that are easy to confuse

These are separate concerns. Conflating them has caused mistakes before.

| Axis | Rule |
| --- | --- |
| **Engine source code** | Most repos track upstream and are kept mergeable. Do **not** wholesale-rebrand source identifiers in engine code just to remove the word "PenguinMod." |
| **Runtime infrastructure / hosts** | Must be **100% patternyard.dev, zero upstream.** Keeping code mergeable never justifies tolerating an upstream host at runtime. |

In short: keep the engine code mergeable, but never let that excuse a runtime
dependency on penguinmod.com.

## Host mapping

| Upstream (forbidden at runtime) | PatternYard replacement |
| --- | --- |
| `penguinmod.com` | `patternyard.dev` |
| `studio.penguinmod.com` | `studio.patternyard.dev` |
| `projects.penguinmod.com` | `api.patternyard.dev` |
| `asset-cdn.penguinmod.com` | `api.patternyard.dev` (warm-tier served by backend) |
| `extensions.penguinmod.com` | `extensions.patternyard.dev` |
| `library.penguinmod.com` | `library.patternyard.dev` |
| `docs.penguinmod.com` | `docs.patternyard.dev` |
