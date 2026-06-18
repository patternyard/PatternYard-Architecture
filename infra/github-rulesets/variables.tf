variable "github_owner" {
  description = "The GitHub organization these rulesets apply to."
  type        = string
  default     = "patternyard"
}

variable "ruleset_name" {
  description = "Display name of the org ruleset, shown in the GitHub UI."
  type        = string
  default     = "require-pr-and-resolved-conversations"
}

variable "enforcement" {
  description = "Ruleset enforcement level. One of: active, evaluate, disabled. Use 'evaluate' for a dry run that reports violations without blocking."
  type        = string
  default     = "active"

  validation {
    condition     = contains(["active", "evaluate", "disabled"], var.enforcement)
    error_message = "enforcement must be one of: active, evaluate, disabled."
  }
}

variable "required_approving_review_count" {
  description = "Approving reviews required before merge. 0 lets an author merge their own PR once conversations are resolved (suitable for a small/solo team)."
  type        = number
  default     = 0
}

variable "additional_protected_branches" {
  description = <<-EOT
    Extra ref patterns to require PRs on, BEYOND each repo's default branch.

    Left empty on purpose: the engine forks push directly to `wycats-main`
    (it is both the upstream-mergeable work branch and the studio deploy
    branch), so requiring PRs there would break the direct-push workflow.
    Add patterns like ["refs/heads/release/*"] only for branches you are
    sure should be PR-gated.
  EOT
  type        = list(string)
  default     = []
}

variable "excluded_repositories" {
  description = "Repository name patterns to exclude from the ruleset (e.g. [\"*-sandbox\"]). Empty means all repos are covered."
  type        = list(string)
  default     = []
}
