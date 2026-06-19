terraform {
  required_version = ">= 1.6"

  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }

  # State is local by default so a single org owner can apply from their machine.
  # For team use, switch to a remote backend (Terraform Cloud, S3 + DynamoDB, etc.)
  # so state is shared and locked. Example:
  #
  #   backend "remote" {
  #     organization = "patternyard"
  #     workspaces { name = "github-rulesets" }
  #   }
}

provider "github" {
  owner = var.github_owner
  # Auth comes from the GITHUB_TOKEN environment variable (a PAT or GitHub App
  # token with the `admin:org` scope). Never hardcode the token here.
}
