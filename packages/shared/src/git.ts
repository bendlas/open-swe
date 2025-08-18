import { SANDBOX_ROOT_DIR } from "./constants.js";
import { TargetRepository, GraphConfig } from "./open-swe/types.js";
import {
  isLocalMode,
  getLocalWorkingDirectory,
} from "./open-swe/local-mode.js";
import { 
  getRepositoryProvider, 
  getRepositoryCloneUrl, 
  isGitHubProvider,
  isSelfHostedProvider,
  getProviderBaseUrl
} from "./git-provider-utils.js";

export function getRepoAbsolutePath(
  targetRepository: TargetRepository,
  config?: GraphConfig,
): string {
  // Check for local mode first
  if (config && isLocalMode(config)) {
    return getLocalWorkingDirectory();
  }

  const repoName = targetRepository.repo;
  if (!repoName) {
    throw new Error("No repository name provided");
  }

  return `${SANDBOX_ROOT_DIR}/${repoName}`;
}

/**
 * Gets the appropriate git clone command for the repository provider
 */
export function getGitCloneCommand(targetRepository: TargetRepository): string[] {
  const cloneUrl = getRepositoryCloneUrl(targetRepository);
  const repoPath = getRepoAbsolutePath(targetRepository);
  
  return ["git", "clone", cloneUrl, repoPath];
}

/**
 * Gets provider-specific git remote URLs
 */
export function getGitRemoteUrl(targetRepository: TargetRepository, remoteName = "origin"): string {
  return getRepositoryCloneUrl(targetRepository);
}

/**
 * Configures git credentials for the repository provider
 */
export function getGitCredentialConfig(targetRepository: TargetRepository): Record<string, string> {
  const provider = getRepositoryProvider(targetRepository);
  const config: Record<string, string> = {};
  
  if (isGitHubProvider(targetRepository)) {
    // GitHub uses token-based authentication
    config["credential.helper"] = "store";
  } else if (isSelfHostedProvider(targetRepository)) {
    // Self-hosted providers may need custom credential handling
    const baseUrl = getProviderBaseUrl(targetRepository);
    const hostname = new URL(baseUrl).hostname;
    
    config[`credential.${hostname}.helper`] = "store";
  }
  
  return config;
}

/**
 * Gets the appropriate API base URL for git operations
 */
export function getGitApiBaseUrl(targetRepository: TargetRepository): string {
  return getProviderBaseUrl(targetRepository);
}
