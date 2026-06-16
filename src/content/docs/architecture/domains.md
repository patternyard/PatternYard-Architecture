---
title: Domains & routing
description: The patternyard.dev subdomain map and how each subdomain reaches its project.
sidebar:
  order: 2
---

The platform lives entirely under **`patternyard.dev`**, a Vercel-registered domain on
Vercel Edge (DNS is auto-managed — there is no external nameserver step). Each surface
gets its own subdomain, mapped to a Vercel project.

## Subdomain map

| Subdomain | Project | Serves |
|---|---|---|
| `patternyard.dev` + `www.` | `patternyard-home` | The home / community site |
| `studio.` | `patternyard-studio` | The editor |
| `api.` | `patternyard-backend` | The backend API (projects, accounts, assets) |
| `packager.` | `patternyard-packager` | Project → HTML/exe packager |
| `extensions.` | `patternyard-extensions` | Extension gallery + manifests |
| `docs.` | `patternyard-docs` | Product documentation |
| `library.` | `patternyard-library` | Costumes, sounds, backpack, project assets |

```d2
direction: right

dns: patternyard.dev\n(Vercel Edge DNS) {shape: cloud; style.fill: "#f4f6fb"}

dns -> home: apex + www
dns -> studio: studio.
dns -> api: api.
dns -> packager: packager.
dns -> extensions: extensions.
dns -> docs: docs.
dns -> library: library.

home: patternyard-home {style.fill: "#dbeafe"}
studio: patternyard-studio {style.fill: "#dbeafe"}
api: patternyard-backend {style.fill: "#fde7c9"}
packager: patternyard-packager {style.fill: "#dbeafe"}
extensions: patternyard-extensions {style.fill: "#e7f5e1"}
docs: patternyard-docs {style.fill: "#e7f5e1"}
library: patternyard-library {style.fill: "#e7f5e1"}
```

## How the subdomains were attached

Each subdomain was added to its project with:

```sh
vercel domains add <subdomain>.patternyard.dev <project> \
  --scope team_1A5hxCsAnX5KFLm69oklRZWB
```

Because the domain is Vercel-registered and on Vercel Edge, DNS records are created
automatically — there is no separate registrar step.

## Why the split matters

The editor (`studio.`) and home (apex) being **different origins** is the single most
consequential routing fact. It means:

- Credentialed editor → backend calls must be on the backend's **CORS allowlist** (the
  allowlist includes both `studio.` and the `www`/apex home origin).
- The editor cannot read the home session directly; it uses the cross-origin
  [`/embed/editor` login bridge](/architecture/editor-bridge/).
- Auth callback URLs and email links must point at the right origin — the backend
  builds these from its `ApiURL` / `HomeURL` / `StudioURL` env vars, not hardcoded
  hosts.

See the [environment reference](/reference/environment/) for exactly which variable
points where.
