# PatternYard Architecture

The single source of truth for **how the PatternYard platform fits together** — the
projects, the domains, the environment wiring, and the runtime message flows between
the editor, home, and backend.

Built with [Astro Starlight](https://starlight.astro.build/) for the docs and
[astro-d2](https://astro-d2.vercel.app/) for the diagrams. Diagrams are authored as
[D2](https://d2lang.com/) text (diagram-as-code), so they live in version control,
diff cleanly, and can be regenerated as the system changes — no binary artifacts to
keep in sync.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
```

```sh
npm run build    # static site -> ./dist
npm run preview  # preview the production build
```

> Diagrams render via D2.js (pure JavaScript, see `astro.config.mjs`), so no native
> `d2` binary is required to build — locally or on Vercel.

## Where things live

| Path | Contents |
|---|---|
| `src/content/docs/index.mdx` | Platform overview + the system map |
| `src/content/docs/architecture/` | Per-area architecture (projects, domains, data, editor bridge) |
| `src/content/docs/operations/` | Runbooks: how to change things and deploy them |
| `src/content/docs/reference/` | Lookup tables: repos, env vars, domains |

## Authoring diagrams

Drop a fenced `d2` code block into any `.md`/`.mdx` page:

````md
```d2
direction: right
editor -> home: postMessage(login)
```
````

It is rendered to a themed SVG at build time. See
[the D2 docs](https://d2lang.com/tour/intro) for the language.
