import { 
  GitProviderConfig, 
  GitProvider,
} from "./git-providers.js";
import {
  GITEA_MCP_SERVER_TEMPLATE,
  FORGEJO_MCP_SERVER_TEMPLATE 
} from "./constants.js";
import { McpServerConfig } from "./open-swe/mcp.js";

/**
 * Creates an MCP server configuration for the specified Git provider
 */
export function createGitProviderMcpServer(
  provider: GitProviderConfig
): McpServerConfig | null {
  const { type, baseUrl, apiToken } = provider;
  
  if (type === "github") {
    // GitHub uses direct API integration, not MCP
    return null;
  }
  
  if (!baseUrl || !apiToken) {
    throw new Error(`Base URL and API token are required for ${type} provider`);
  }
  
  let template;
  switch (type) {
    case "gitea":
      template = GITEA_MCP_SERVER_TEMPLATE;
      break;
    case "forgejo":
      template = FORGEJO_MCP_SERVER_TEMPLATE;
      break;
    default:
      throw new Error(`Unsupported Git provider: ${type}`);
  }
  
  // Replace template variables
  const config = JSON.parse(JSON.stringify(template));
  const replacements = {
    [`${type.toUpperCase()}_BASE_URL`]: baseUrl,
    [`${type.toUpperCase()}_TOKEN`]: apiToken,
  };
  
  // Replace in args
  config.args = config.args.map((arg: string) => {
    for (const [key, value] of Object.entries(replacements)) {
      arg = arg.replace(`\${${key}}`, value);
    }
    return arg;
  });
  
  // Replace in env
  if (config.env) {
    for (const [envKey, envValue] of Object.entries(config.env)) {
      if (typeof envValue === "string") {
        for (const [key, value] of Object.entries(replacements)) {
          config.env[envKey] = envValue.replace(`\${${key}}`, value);
        }
      }
    }
  }
  
  return config;
}

/**
 * Gets the MCP server name for a Git provider
 */
export function getGitProviderMcpServerName(provider: GitProvider): string {
  return `${provider}-mcp`;
}