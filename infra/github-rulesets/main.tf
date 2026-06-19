# Org-wide ruleset: every repository must take changes to its default branch
# through a pull request, and all review conversations must be resolved before
# merging. One org-level ruleset replaces per-repo branch protection and applies
# automatically to repositories created in the future — no templating or sync
# infrastructure required.
#
# NOTE: GitHub org rulesets are free for PUBLIC repositories. Private repos
# require a paid plan (Team or higher). With the org on the Free plan, this
# ruleset effectively governs the public repos; make a repo public (or upgrade)
# to bring it under enforcement.

resource "github_organization_ruleset" "require_pr_and_resolution" {
  name        = var.ruleset_name
  target      = "branch"
  enforcement = var.enforcement

  conditions {
    ref_name {
      # Each repo's own default branch, plus any opt-in extra patterns.
      include = concat(["~DEFAULT_BRANCH"], var.additional_protected_branches)
      exclude = []
    }

    repository_name {
      include = ["~ALL"]
      exclude = var.excluded_repositories
      # Prevent renaming a repo to dodge the ruleset.
      protected = true
    }
  }

  rules {
    # Block deleting and force-pushing the protected branches.
    deletion         = true
    non_fast_forward = true

    # The core requirement: changes must arrive via a pull request.
    pull_request {
      required_approving_review_count   = var.required_approving_review_count
      required_review_thread_resolution = true
      dismiss_stale_reviews_on_push     = false
      require_code_owner_review         = false
      require_last_push_approval        = false
    }
  }

  # No bypass actors are defined: even org admins go through a PR. Org owners can
  # still edit or disable this ruleset in Settings, so there is no lockout risk.
  # To grant a controlled exception, add a bypass_actors block, e.g.:
  #
  #   bypass_actors {
  #     actor_type  = "OrganizationAdmin"
  #     bypass_mode = "pull_request"
  #   }
}
