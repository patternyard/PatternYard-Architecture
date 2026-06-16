---
title: How to use these docs
description: What lives here, how it is organized, and how to keep it current.
---

This site documents the PatternYard platform as a **system**, not any single repo. It
exists because the platform spans roughly twenty repositories and seven deployed
projects, and no individual README captures how they connect.

## How it is organized

- **Architecture** — how the system is built: the [projects](/architecture/projects/),
  the [domains](/architecture/domains/), the [data and storage](/architecture/data-flow/)
  model, and the [editor login bridge](/architecture/editor-bridge/).
- **Operations** — how to *work* on it: the two [deploy loops](/operations/making-changes/)
  and the [deployment runbook](/operations/deployment/) with its known gotchas.
- **Reference** — flat lookup tables: the [repository inventory](/reference/repositories/)
  and the [environment variable map](/reference/environment/).

## Diagrams are code

Every diagram on this site is authored as [D2](https://d2lang.com/) text inside the page
that uses it — there are no binary image files to fall out of sync. To change a diagram,
edit its fenced `d2` block and rebuild; the SVG regenerates. This is deliberate: the
architecture changes, and a diagram you cannot diff is a diagram that goes stale.

## Keeping it current

Treat these pages like code. When you change how services connect — a new subdomain, a
new cross-service call, a moved responsibility — update the relevant page in the same
change set. The [reference tables](/reference/repositories/) in particular are meant to
be authoritative; if they drift, they are worse than nothing.

:::note
This is documentation, not a live dashboard. It describes intended structure and the
verified state at the time of writing. For live status, check the Vercel dashboard and
the actual deployments.
:::
