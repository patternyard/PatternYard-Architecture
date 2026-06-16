---
title: Deployment runbook
description: The exact deploy commands for the PatternYard projects, plus the gotchas specific to this environment.
sidebar:
  order: 2
---

This is the practical runbook for deploying the PatternYard apps. It captures the
commands and the failure modes that have actually bitten in this environment.

## The scope flag

Every Vercel CLI call must target the team, or it defaults to a personal scope and
appears to do nothing:

```sh
--scope team_1A5hxCsAnX5KFLm69oklRZWB
```

## Force a production deploy

Merging a PR produces only a **Preview** deploy for these projects. To ship to
production, clone the production branch fresh and promote explicitly:

```sh
gh repo clone patternyard/<repo> _deploy -- --depth=1 -b <prod-branch>
cd _deploy
git remote remove upstream            # forks carry an upstream remote; drop it
vercel link --project <project> --yes --non-interactive --scope team_...
vercel deploy --prod --yes --scope team_...
```

The studio editor deploys from the **`wycats-main`** branch, not `develop` (its default).

## Gotchas

:::danger[The VM resets between turns]
Uncommitted work — and even local commits — are wiped between turns, and local clones
disappear. Always **push in the same command as the commit**, and re-clone fresh each
session. Do not assume a previous clone still exists.
:::

:::caution[GH_TOKEN is not always in the shell env]
A bare `git push` can 401 because `GH_TOKEN` is not expanded in some shells. Resolve it
explicitly:

```sh
TOK=$(gh auth token)
git push "https://x-access-token:${TOK}@github.com/patternyard/<repo>.git" \
  <branch>:<branch>
```
:::

:::caution[Preview builds need their own env vars]
Vercel environments are separate. The home project once had its `PUBLIC_*` vars only in
Production + Development, so **every Preview build failed** (the code imports them via
`$env/static/public`, which hard-fails the build when absent). When adding a build-time
public var, add it to **Preview** too.

`vercel env add <key> preview` interactively prompts for a git branch and will eat piped
stdin. Create preview vars via the API instead:

```sh
echo '{"key":"K","value":"V","type":"plain","target":["preview"]}' \
  | vercel api "/v10/projects/<project>/env?teamId=team_..." -X POST --input -
```

(`vercel api` takes a body via `--input -`, not `-d`.)
:::

:::caution[Auto-commit hook fires mid-edit]
On large multi-file commits an auto-commit hook can fire partway through. Keep commits
to 2–3 logical files so the bulk lands cleanly and any residual is obvious. Avoid
`git stash` — the hook can drop the stash entry silently. Commit before any history
operation.
:::

## Verify on the live domain

After a production deploy, verify against the real domain (the preview window does not
reflect these apps). For protected preview URLs, use `vercel curl <url>` to bypass
deployment protection; production subdomains are public.
