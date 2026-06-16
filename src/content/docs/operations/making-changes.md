---
title: Making changes
description: The two distinct edit-and-preview loops, and which one to use.
sidebar:
  order: 1
---

There are **two separate environments** in play, and conflating them is the most common
source of confusion. Pick the loop that matches what you are changing.

```d2
direction: right

dev: You {shape: person}

loopA: Loop A — component library {
  style.fill: "#dbeafe"
  edit: Edit file
  hmr: vite dev HMR
  preview: Preview window\n(this VM)
  edit -> hmr -> preview
}

loopB: Loop B — deployed apps {
  style.fill: "#fde7c9"
  clone: Fresh git clone
  pr: PR -> merge
  deploy: vercel deploy --prod
  live: patternyard.dev
  clone -> pr -> deploy -> live
}

dev -> loopA: working on PatternYard-SvelteUI
dev -> loopB: working on home / editor / backend
```

## Loop A — the component library (instant preview)

The repo connected to this workspace is **`PatternYard-SvelteUI`**, a SvelteKit
*component library* (not an app). Its preview window runs a local dev server:

```sh
npm install        # first time only
npm run dev        # vite dev server; the preview window attaches automatically
```

Edit any component or the showcase route and HMR updates the preview instantly. This is
the loop for working on shared UI components.

:::note[Why the preview was blank before]
A library has no app to render until its dev server is running and dependencies are
installed. Once `npm install` + `npm run dev` are done, the showcase route renders and
the preview attaches to the detected port.
:::

## Loop B — the deployed apps (PR + deploy)

The apps that actually run `patternyard.dev` (home, editor, backend, packager, …) live
in their **own repositories** and deploy on Vercel. They do **not** appear in this
workspace's preview window. The loop is:

1. **Clone fresh** — `gh repo clone patternyard/<repo>` into a scratch directory. (The
   VM resets between turns, so always re-clone; do not rely on a previous clone.)
2. **Edit + commit** on a feature branch, then open a PR.
3. **Merge** the PR.
4. **Force a production deploy** — for these projects, a git merge produces only a
   *Preview* deploy, so promote it explicitly:
   ```sh
   vercel deploy --prod --yes --scope team_1A5hxCsAnX5KFLm69oklRZWB
   ```
5. **Verify on the live domain**, not in the preview window.

See the [deployment runbook](/operations/deployment/) for the exact commands and the
gotchas that bite in this environment.

## Which loop?

| If you are changing… | Use |
|---|---|
| A shared Svelte component | Loop A (this workspace) |
| The home site, editor, backend, packager, extensions, docs | Loop B (clone + PR + deploy) |
| These architecture docs | Loop B against `PatternYard-Architecture` |
