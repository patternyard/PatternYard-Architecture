---
title: Data & storage
description: How content roots resolve, and how the backend and library service reach storage.
sidebar:
  order: 4
---

Two separate concerns live here: how the **editor resolves content roots** at build
time, and how the **backend and library service reach physical storage** at runtime.

## Content roots (build time)

The editor reads five content roots from `src/lib/pm-config.js`. Each is a build-time
`process.env.PM_*` value (inlined via webpack `DefinePlugin`) with a default that points
upstream. We override the env vars to point at our own subdomains; the defaults stay
upstream so the fork remains mergeable.

| Root | Points at | Notes |
|---|---|---|
| `PM_API_ROOT` | `api.patternyard.dev` | Backend API |
| `PM_EXTENSIONS_ROOT` | `extensions.patternyard.dev` | Extension manifests |
| `PM_DOCS_ROOT` | `docs.patternyard.dev` | Help links |
| `PM_LIBRARY_ROOT` | `library.patternyard.dev` | Costumes, sounds, backpack |
| `PM_ASSET_CDN_ROOT` | `library.patternyard.dev` | Project assets |
| `PM_HOME_ROOT` | `patternyard.dev` | Login bridge + share targets |

:::caution[Build-time, not runtime]
Because these are inlined at build time, **changing the env var requires a redeploy** of
the editor to take effect. There is no way to flip a root without rebuilding.
:::

## Storage (runtime)

Only the backend and the library service touch physical storage. The user-facing
surfaces never hold storage credentials.

```d2
direction: right

editor: Editor {style.fill: "#dbeafe"}
home: Home {style.fill: "#dbeafe"}
packager: Packager {style.fill: "#dbeafe"}

api: Backend API\n(api.) {style.fill: "#fde7c9"}
library: Library service\n(library.) {style.fill: "#e7f5e1"}

blob: Vercel Blob {shape: cylinder; style.fill: "#f4f6fb"}
db: Database {shape: cylinder; style.fill: "#f4f6fb"}
redis: Redis\n(sessions, cache, limits) {shape: cylinder; style.fill: "#f4f6fb"}

editor -> api
home -> api
packager -> api
editor -> library: asset reads

api -> blob: project assets
api -> db: accounts, projects, metadata
api -> redis: sessions + rate limits

library -> blob: serve / mirror-on-demand
library -> upstream: proxy on cache miss
upstream: Upstream asset host {style.stroke-dash: 3; style.fill: "#f4f6fb"}
```

## Mirror-on-demand for the library

`library.` and the asset CDN have **no source repo** — they are content services. Rather
than bulk-copying gigabytes of community assets up front, the library service uses
**mirror-on-demand**: on a cache miss it proxies the asset from the upstream host and
writes it to our Blob store, so subsequent requests are served locally. This gives
independence without a multi-GB migration and degrades gracefully. A full bulk mirror
can follow later if we want zero upstream dependency.

## Backend env vars that wire it together

The backend builds cross-service URLs and links from environment variables rather than
hardcoded hosts — see the [environment reference](/reference/environment/):

- `ApiURL`, `HomeURL`, `StudioURL` — used for redirects, share links, mod-log embeds,
  and email-verification links.
- Storage credentials (`MONGODB_URI`/database URL, `REDIS_URL`/`KV_*`,
  `BLOB_READ_WRITE_TOKEN`) — live **only** on the backend project.
