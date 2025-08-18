export type GitProvider = "github" | "gitea" | "forgejo";

export interface GitProviderConfig {
  type: GitProvider;
  baseUrl?: string;  // For self-hosted instances
  apiToken?: string; // For authentication
  mcpServerName?: string; // Name of associated MCP server
}

export interface TargetRepositoryWithProvider {
  owner: string;
  repo: string;
  branch?: string;
  baseCommit?: string;
  provider?: GitProviderConfig;
}

export const DEFAULT_PROVIDER_CONFIGS: Record<GitProvider, GitProviderConfig> = {
  github: {
    type: "github",
    baseUrl: "https://api.github.com",
  },
  gitea: {
    type: "gitea",
    mcpServerName: "gitea-mcp",
  },
  forgejo: {
    type: "forgejo", 
    mcpServerName: "forgejo-mcp",
  },
};

export function detectProviderFromUrl(repoUrl: string): GitProvider {
  if (repoUrl.includes("github.com")) {
    return "github";
  }
  // For now, default to gitea for non-GitHub URLs
  // This could be enhanced with more sophisticated detection
  return "gitea";
}

export function getProviderApiUrl(provider: GitProviderConfig): string {
  return provider.baseUrl || `${provider.baseUrl || "http://localhost:3000"}/api/v1`;
}