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
    return targetRepository.provider.baseUrl;
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
  const baseUrl = getProviderBaseUrl(targetRepository);
  const hostUrl = baseUrl.replace("/api/v1", "").replace("/api", "");
  return `${hostUrl}/${owner}/${repo}.git`;
}