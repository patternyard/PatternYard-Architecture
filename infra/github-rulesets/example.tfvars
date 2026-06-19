# Copy to a real *.tfvars file (e.g. terraform.tfvars) and adjust as needed.
# Run with: terraform apply -var-file=terraform.tfvars

github_owner                    = "patternyard"
ruleset_name                    = "require-pr-and-resolved-conversations"
enforcement                     = "active" # use "evaluate" for a non-blocking dry run
required_approving_review_count = 0

# Beyond each repo's default branch, PR-gate nothing else by default.
# See README — do NOT add wycats-main unless you intend to change that workflow.
additional_protected_branches = []

# Exempt no repositories.
excluded_repositories = []
