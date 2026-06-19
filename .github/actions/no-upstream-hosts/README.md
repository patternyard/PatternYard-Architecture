# No upstream hosts (CI guard)

A reusable composite action that **fails CI if any upstream (PenguinMod-owned)
runtime host** appears in tracked files outside an allowlist. It enforces the
PatternYard runtime-independence success criterion: application code must reach
**zero** `*.penguinmod.com` (and related upstream) hosts at runtime, with no
upstream fallback.

Hosts it flags:

- `penguinmod.com` and any subdomain (`*.penguinmod.com`)
- migration-era preview hosts `penguinmod-*.vercel.app`
- the upstream GitHub Pages host `penguinmod.github.io`

## Why a shared action (not per-repo scripts)

The check logic lives once, here. Every repo consumes it through a tiny caller
workflow, so improvements propagate without editing ~19 repos — the first-party
alternative to templating/syncing copies of a script.

## Use it in another repo

Add `.github/workflows/no-upstream-hosts.yml`:

```yaml
name: No upstream hosts
on: [pull_request]
jobs:
  no-upstream-hosts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: patternyard/PatternYard-Architecture/.github/actions/no-upstream-hosts@main
```

Then add a `.penguinmod-host-allowlist` at the repo root for the legitimate
exceptions (see below).

> Note: the consuming repo must be allowed to use actions from
> `patternyard/PatternYard-Architecture` (org Actions policy → allow actions
> from this organization). Public repos can use it without extra setup.

## Allowlist

`.penguinmod-host-allowlist` is gitignore-style (one path glob per line; `#`
comments; `*` within a segment, `**` across segments). Only these belong in it:

- **Rewrite tooling** that intentionally contains the upstream host as the thing
  it replaces (e.g. a rebrand/host-map pipeline).
- **Migration provenance** — keys that record what was forked from where (not a
  runtime host), e.g. a stack manifest.
- **Documentation** that names the upstream project when explaining the migration.

Never allowlist application/runtime code. For a one-off legitimate line, put the
inline marker `penguinmod-host-allow` in a comment on that line instead.

## Rollout ordering

Because consumers reference this action at `@main`, **merge the action into
`PatternYard-Architecture` first**, then add the caller workflow to each repo
(ideally in the same PR that makes that repo's runtime hosts independent, so the
branch is already green).

## Local run

From a repo checkout:

```bash
node path/to/check.mjs --allow-file .penguinmod-host-allowlist
```

Exit codes: `0` clean, `1` violations found, `2` setup error.
