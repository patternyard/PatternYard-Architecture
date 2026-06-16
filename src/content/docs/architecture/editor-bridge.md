---
title: The editor login bridge
description: How the editor (a separate origin) learns who is logged in on the home site.
sidebar:
  order: 3
---

The editor and the home site are **different origins** (`studio.patternyard.dev` vs
`patternyard.dev`), so the editor cannot read the home site's session directly. To show
the signed-in username, it uses a small cross-origin **login bridge** built on
`postMessage`.

## The flow

The editor embeds a hidden `100×100` iframe pointed at the home site's `/embed/editor`
route, passing its own origin as the `external` query parameter. That route reads the
home session and posts the identity back to the editor.

```d2
direction: down

editor: Editor\n(studio.patternyard.dev) {style.fill: "#dbeafe"}
iframe: Hidden iframe\n/embed/editor?external=studio. {style.fill: "#fff7d6"}
bridge: Home bridge route\n(patternyard.dev) {style.fill: "#e7f5e1"}
session: pm:session\n(home session store) {shape: cylinder; style.fill: "#f4f6fb"}

editor -> iframe: mounts with\nexternal = own origin
iframe -> bridge: loads route
bridge -> session: read userCachedId\n+ username
bridge -> editor: postMessage\ntype login, packet loggedIn + username
```

## The contract

| Side | Responsibility |
|---|---|
| **Editor** (`src/containers/home-communication.jsx` in `patternyard-studio`) | Mounts the hidden iframe at `${PM_HOME_ROOT}/embed/editor?external=<editorOrigin>` and listens for a `message` of shape `{ type: "login", packet: { loggedIn: true, username } }`. |
| **Home** (`src/routes/embed/editor/+page.svelte` in `PatternYard-Home`) | Client-only route (`prerender = false`, `ssr = false`). Validates the `external` origin, reads identity from `$lib/stores/session.js`, and posts the packet **only** to that exact origin (never `"*"`). |

## Two things to know

:::caution[The home login flow is not built yet]
The bridge route exists and is correct, but the home rewrite does **not** yet populate
`pm:session` with a logged-in user — there is no account/login UI in
`PatternYard-Home` today. So the bridge currently reports "not logged in" and posts
nothing. It will activate automatically once a login flow lands. Until then, login
itself still works directly against the `api.` backend; only the in-editor username
*display* is affected.
:::

:::tip[PM_HOME_ROOT must be in the webpack allowlist]
The editor only inlines `process.env.PM_*` values that are listed in its webpack
`DefinePlugin` allowlist. `PM_HOME_ROOT` was added there specifically so the bridge
targets `patternyard.dev` instead of falling back to the hardcoded upstream default.
Adding the env var alone is not enough — it must also be in the allowlist.
:::
