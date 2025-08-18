import { TargetRepository } from "./open-swe/types.js";
import { GitProvider } from "./git-providers.js";

/**
 * Gets the Git provider for a target repository
 */
export function getRepositoryProvider(targetRepository: TargetRepository): GitProvider {
  // If provider is explicitly set, use it
  if (targetRepository.provider?.type) {
    return targetRepository.provider.type;
  }
  
  // For backward compatibility, assume GitHub if no provider is specified
  // In a real implementation, you might detect based on repository URL or other context
  return "github";
}

/**
 * Gets the base URL for a repository provider
 */
export function getProviderBaseUrl(targetRepository: TargetRepository): string {
  const provider = getRepositoryProvider(targetRepository);
  
  if (provider === "github") {
    return "https://api.github.com";
  }
  
  // For self-hosted instances, use the configured base URL
  if (targetRepository.provider?.baseUrl) {
    // If the base URL doesn't include the API path, add it
    const baseUrl = targetRepository.provider.baseUrl;
    if (baseUrl.endsWith("/api/v1")) {
      return baseUrl;
    }
    return `${baseUrl}/api/v1`;
  }
  
  // Default fallback for self-hosted instances
  return "http://localhost:3000/api/v1";
}

/**
 * Gets the web UI base URL for a repository provider
 */
export function getProviderWebUrl(targetRepository: TargetRepository): string {
  const provider = getRepositoryProvider(targetRepository);
  
  if (provider === "github") {
    return "https://github.com";
  }
  
  // For self-hosted instances, use the configured base URL without API path
  if (targetRepository.provider?.baseUrl) {
    const baseUrl = targetRepository.provider.baseUrl;
    return baseUrl.replace("/api/v1", "").replace("/api", "");
  }
  
  // Default fallback for self-hosted instances
  return "http://localhost:3000";
}

/**
 * Checks if the repository uses GitHub
 */
export function isGitHubProvider(targetRepository: TargetRepository): boolean {
  return getRepositoryProvider(targetRepository) === "github";
}

/**
 * Checks if the repository uses a self-hosted Git provider (Gitea/Forgejo)
 */
export function isSelfHostedProvider(targetRepository: TargetRepository): boolean {
  const provider = getRepositoryProvider(targetRepository);
  return provider === "gitea" || provider === "forgejo";
}

/**
 * Gets the repository clone URL based on the provider
 */
export function getRepositoryCloneUrl(targetRepository: TargetRepository): string {
  const { owner, repo } = targetRepository;
  
  if (isGitHubProvider(targetRepository)) {
    return `https://github.com/${owner}/${repo}.git`;
  }
  
  // For self-hosted instances
  const webUrl = getProviderWebUrl(targetRepository);
  return `${webUrl}/${owner}/${repo}.git`;
}

/**
 * Gets the repository web URL based on the provider
 */
export function getRepositoryWebUrl(targetRepository: TargetRepository): string {
  const { owner, repo } = targetRepository;
  const webUrl = getProviderWebUrl(targetRepository);
  return `${webUrl}/${owner}/${repo}`;
}

/**
 * Gets the issue URL for a specific issue number
 */
export function getIssueWebUrl(targetRepository: TargetRepository, issueNumber: number): string {
  const repoUrl = getRepositoryWebUrl(targetRepository);
  return `${repoUrl}/issues/${issueNumber}`;
}

/**
 * Gets the pull request URL for a specific PR number
 */
export function getPullRequestWebUrl(targetRepository: TargetRepository, prNumber: number): string {
  const repoUrl = getRepositoryWebUrl(targetRepository);
  const provider = getRepositoryProvider(targetRepository);
  
  if (provider === "github") {
    return `${repoUrl}/pull/${prNumber}`;
  } else {
    // Gitea/Forgejo use "pulls" instead of "pull"
    return `${repoUrl}/pulls/${prNumber}`;
  }
}

/**
 * Gets the API URL for repository operations
 */
export function getRepositoryApiUrl(targetRepository: TargetRepository): string {
  const { owner, repo } = targetRepository;
  const apiUrl = getProviderBaseUrl(targetRepository);
  return `${apiUrl}/repos/${owner}/${repo}`;
}

/**
 * Detects provider from repository URL
 */
export function detectProviderFromUrl(repoUrl: string): GitProvider {
  if (repoUrl.includes("github.com")) {
    return "github";
  }
  // Could be enhanced to detect Forgejo vs Gitea based on API responses or other indicators
  // For now, default to gitea for non-GitHub URLs
  return "gitea";
}