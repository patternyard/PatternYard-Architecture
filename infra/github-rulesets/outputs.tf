output "ruleset_id" {
  description = "GitHub ID of the created organization ruleset."
  value       = github_organization_ruleset.require_pr_and_resolution.ruleset_id
}

output "ruleset_name" {
  description = "Name of the organization ruleset as shown in the GitHub UI."
  value       = github_organization_ruleset.require_pr_and_resolution.name
}
