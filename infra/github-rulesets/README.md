# GitHub org rulesets (config-as-code)

Terraform that enforces, across the whole `patternyard` organization:

- **Changes to the default branch must go through a pull request** (direct pushes blocked).
- **All review conversations must be resolved before merging.**
- Protected branches cannot be deleted or force-pushed.

This is a single **organization-level ruleset**. It applies to every repository
(`~ALL`) and automatically covers repositories created later, so there is no
per-repo branch protection to template or sync.

## Why this instead of templating per-repo

GitHub org rulesets are the first-party way to apply one policy to many repos.
A templated/sync approach (copying branch-protection config into each repo via
an Action) is only needed when org rulesets are unavailable. They are available
here, so we use them.

## Plan limitation (important)

Org rulesets are **free for public repositories only**. Private repos need a
paid plan (Team or higher). The org is currently on **Free**, so:

- The 20 **public** repos are governed by this ruleset.
- Any **private** repo is not enforced until it is made public or the org
  upgrades. (As of writing, `PatternYard-Home` is the only private repo.)

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.6
- A token with the **`admin:org`** scope, exported as an environment variable.
  An **org owner** must create/run this — fine-grained tokens need
  "Organization administration: read and write".

```bash
export GITHUB_TOKEN="ghp_your_admin_org_token"
```

## Apply

```bash
cd infra/github-rulesets

terraform init

# Preview without touching GitHub. Tip: do a no-block dry run first by setting
#   enforcement = "evaluate"
# in a *.tfvars file or with -var, then inspect the ruleset's insights in the UI.
terraform plan

# Create/update the ruleset.
terraform apply
```

## Configuration

All knobs live in `variables.tf`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `github_owner` | `patternyard` | Org the ruleset belongs to. |
| `ruleset_name` | `require-pr-and-resolved-conversations` | Name shown in the GitHub UI. |
| `enforcement` | `active` | `active`, `evaluate` (dry run), or `disabled`. |
| `required_approving_review_count` | `0` | Approvals needed. `0` lets an author self-merge once conversations are resolved. |
| `additional_protected_branches` | `[]` | Extra ref patterns to PR-gate beyond the default branch. |
| `excluded_repositories` | `[]` | Repo name patterns to exempt. |

### About `wycats-main`

`additional_protected_branches` is intentionally empty. The engine forks push
**directly** to `wycats-main` (the upstream-mergeable work branch, which is also
the studio deploy branch). Requiring PRs there would break that workflow, so it
is left as a deliberate opt-in rather than a default.

## State

Defaults to **local state** for a single owner applying from their machine. For
team use, configure a remote backend (see the commented block in `versions.tf`)
so state is shared and locked.
