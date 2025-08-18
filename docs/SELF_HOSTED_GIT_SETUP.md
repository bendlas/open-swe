# Gitea/Forgejo MCP Server Setup

This document provides instructions for setting up MCP servers for Gitea and Forgejo self-hosted Git providers.

## Quick Setup

1. **Configure Git Provider in Open SWE UI:**
   - Go to Settings > Configuration
   - Set "Git Provider Type" to "gitea" or "forgejo"
   - Set "Git Provider Base URL" to your instance URL (e.g., `https://git.example.com`)
   - Set "Git Provider Token" to your API token

2. **Open SWE will automatically configure the MCP server** based on your settings.

## Manual MCP Server Configuration

If you prefer to configure the MCP server manually via the "MCP Servers" JSON configuration:

```json
{
  "langgraph-docs-mcp": {
    "command": "uvx",
    "args": [
      "--from",
      "mcpdoc", 
      "mcpdoc",
      "--urls",
      "LangGraphPY:https://langchain-ai.github.io/langgraph/llms.txt LangGraphJS:https://langchain-ai.github.io/langgraphjs/llms.txt",
      "--transport",
      "stdio"
    ],
    "stderr": "inherit"
  },
  "gitea-mcp": {
    "command": "npx",
    "args": [
      "gitea-mcp-server",
      "--base-url",
      "https://git.example.com",
      "--token",
      "your-api-token"
    ],
    "stderr": "inherit",
    "env": {
      "GITEA_BASE_URL": "https://git.example.com",
      "GITEA_TOKEN": "your-api-token"
    }
  }
}
```

## Example Gitea MCP Server Implementation

Since MCP servers for Gitea/Forgejo may not exist yet, here's an example implementation structure:

### Installation

```bash
npm install -g gitea-mcp-server  # hypothetical package
```

### Basic Usage

```bash
gitea-mcp-server --base-url https://git.example.com --token your-token
```

### Features that should be supported:

- Repository browsing and file reading
- Issue creation and management
- Pull request operations
- Branch operations
- Git history and diff viewing
- User and organization management

## API Token Setup

### For Gitea:
1. Go to Settings > Applications > Generate New Token
2. Select appropriate scopes (repo, user, etc.)
3. Copy the generated token

### For Forgejo:
1. Similar to Gitea (Forgejo is a fork of Gitea)
2. Go to Settings > Applications > Generate New Token
3. Select appropriate scopes
4. Copy the generated token

## Environment Variables

The MCP server can also be configured via environment variables:

```bash
export GITEA_BASE_URL=https://git.example.com
export GITEA_TOKEN=your-api-token
export FORGEJO_BASE_URL=https://forge.example.com  
export FORGEJO_TOKEN=your-api-token
```

## Troubleshooting

1. **Connection Issues**: Verify the base URL is correct and accessible
2. **Authentication Issues**: Ensure the API token has sufficient permissions
3. **SSL Issues**: For self-signed certificates, you may need additional configuration

## Creating Custom MCP Servers

If you need to create a custom MCP server for your Git provider:

1. Follow the [MCP SDK documentation](https://modelcontextprotocol.io/)
2. Implement the required Git operations as MCP tools
3. Handle authentication and API communication
4. Register the server in Open SWE's configuration

## Notes

- This implementation assumes hypothetical `gitea-mcp-server` and `forgejo-mcp-server` packages
- The actual implementation of these servers would need to be created or found
- The configuration structure follows MCP standards and LangChain MCP Adapters format