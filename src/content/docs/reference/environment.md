---
title: Environment variables
description: Which variable lives on which project and what it controls.
sidebar:
  order: 2
---

PatternYard is wired together almost entirely through environment variables — there are
no hardcoded cross-service URLs left in the deployed code. This page is the map of which
variable lives where.

:::caution[Values are not listed here]
This page documents **keys and ownership**, never secret values. Read live values from
the Vercel dashboard or `vercel env` with the team scope.
:::

## Editor (`patternyard-studio`) — build-time roots

These resolve in `src/lib/pm-config.js` via webpack `DefinePlugin`. They are inlined at
build time, so **changing one requires a redeploy**. Each must be present in *both* the
project env *and* the DefinePlugin allowlist to take effect.

| Key | Points at |
|---|---|
| `PM_API_ROOT` | `https://api.patternyard.dev` |
| `PM_EXTENSIONS_ROOT` | `https://extensions.patternyard.dev` |
| `PM_DOCS_ROOT` | `https://docs.patternyard.dev` |
| `PM_LIBRARY_ROOT` | `https://library.patternyard.dev` |
| `PM_ASSET_CDN_ROOT` | `https://library.patternyard.dev` |
| `PM_HOME_ROOT` | `https://patternyard.dev` |

## Home (`patternyard-home`) — public build vars

Imported via `$env/static/public`, so a missing one **hard-fails the build**. Must exist
in Production, Preview, **and** Development.

| Key | Value |
|---|---|
| `PUBLIC_API_URL` | `https://api.patternyard.dev` |
| `PUBLIC_STUDIO_URL` | `https://studio.patternyard.dev` |
| `PUBLIC_CAPTCHA_ENABLED` | `true` |
| `PUBLIC_MAX_UPLOAD_SIZE` | `32` |

## Backend (`patternyard-backend`)

The only project that holds storage credentials, plus the cross-service URLs used for
redirects, share links, mod-log embeds, and email-verification links.

| Key | Role |
|---|---|
| `ApiURL` | This backend's own public origin (`https://api.patternyard.dev`) |
| `HomeURL` | Home origin — share links, redirects |
| `StudioURL` | Editor origin — used in the CORS allowlist |
| `MONGODB_URI` / database URL | Primary datastore |
| `REDIS_URL` / `KV_*` | Sessions, cache, rate limits |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob access for assets |
| limit/toggle vars (`EmailLimit`, `MaxViews`, `UploadingEnabled`, …) | Operational tuning |

:::note[Production values can read back empty]
On the backend project, `vercel env pull` / `env ls` may show Production values as empty
even though they apply correctly at runtime. Verify by runtime behavior (e.g. a working
CORS preflight or a successful email link), not by reading the value back.
:::

## CORS allowlist

The backend's CORS allowlist includes both editor and home origins, because the editor
is a **separate origin** making credentialed calls:

- `https://studio.patternyard.dev`
- `https://patternyard.dev` (and the `www.` variant)

If a credentialed editor → backend call starts failing, the allowlist is the first thing
to check.
