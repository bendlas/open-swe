import { describe, it, expect } from "@jest/globals";
import { 
  createGitProviderMcpServer, 
  getGitProviderMcpServerName 
} from "@open-swe/shared/git-provider-mcp";
import {
  getRepositoryProvider,
  getProviderBaseUrl,
  isGitHubProvider,
  isSelfHostedProvider,
  getRepositoryCloneUrl
} from "@open-swe/shared/git-provider-utils";
import { TargetRepository } from "@open-swe/shared/open-swe/types";

describe("Git Provider Support", () => {
  describe("createGitProviderMcpServer", () => {
    it("should create Gitea MCP server configuration", () => {
      const config = createGitProviderMcpServer({
        type: "gitea",
        baseUrl: "https://git.example.com",
        apiToken: "test-token",
      });

      expect(config).toBeDefined();
      if (config && "command" in config) {
        expect(config.command).toBe("npx");
        expect(config.args).toContain("gitea-mcp-server");
        expect(config.args).toContain("https://git.example.com");
        expect(config.args).toContain("test-token");
      }
    });

    it("should create Forgejo MCP server configuration", () => {
      const config = createGitProviderMcpServer({
        type: "forgejo",
        baseUrl: "https://forge.example.com",
        apiToken: "forge-token",
      });

      expect(config).toBeDefined();
      if (config && "command" in config) {
        expect(config.command).toBe("npx");
        expect(config.args).toContain("forgejo-mcp-server");
        expect(config.args).toContain("https://forge.example.com");
        expect(config.args).toContain("forge-token");
      }
    });

    it("should return null for GitHub provider", () => {
      const config = createGitProviderMcpServer({
        type: "github",
        baseUrl: "https://api.github.com",
      });

      expect(config).toBeNull();
    });

    it("should throw error for missing baseUrl", () => {
      expect(() => {
        createGitProviderMcpServer({
          type: "gitea",
          apiToken: "test-token",
        });
      }).toThrow("Base URL and API token are required");
    });

    it("should throw error for missing apiToken", () => {
      expect(() => {
        createGitProviderMcpServer({
          type: "gitea", 
          baseUrl: "https://git.example.com",
        });
      }).toThrow("Base URL and API token are required");
    });
  });

  describe("getGitProviderMcpServerName", () => {
    it("should return correct server names", () => {
      expect(getGitProviderMcpServerName("gitea")).toBe("gitea-mcp");
      expect(getGitProviderMcpServerName("forgejo")).toBe("forgejo-mcp");
    });
  });

  describe("Provider detection and utilities", () => {
    it("should detect GitHub provider by default", () => {
      const repo: TargetRepository = {
        owner: "owner",
        repo: "repo",
      };

      expect(getRepositoryProvider(repo)).toBe("github");
      expect(isGitHubProvider(repo)).toBe(true);
      expect(isSelfHostedProvider(repo)).toBe(false);
    });

    it("should detect configured provider", () => {
      const repo: TargetRepository = {
        owner: "owner",
        repo: "repo",
        provider: {
          type: "gitea",
          baseUrl: "https://git.example.com",
          apiToken: "token",
        },
      };

      expect(getRepositoryProvider(repo)).toBe("gitea");
      expect(isGitHubProvider(repo)).toBe(false);
      expect(isSelfHostedProvider(repo)).toBe(true);
    });

    it("should return correct base URLs", () => {
      const githubRepo: TargetRepository = {
        owner: "owner",
        repo: "repo",
      };

      const giteaRepo: TargetRepository = {
        owner: "owner",
        repo: "repo",
        provider: {
          type: "gitea",
          baseUrl: "https://git.example.com/api/v1",
        },
      };

      expect(getProviderBaseUrl(githubRepo)).toBe("https://api.github.com");
      expect(getProviderBaseUrl(giteaRepo)).toBe("https://git.example.com/api/v1");
    });

    it("should generate correct clone URLs", () => {
      const githubRepo: TargetRepository = {
        owner: "owner",
        repo: "repo",
      };

      const giteaRepo: TargetRepository = {
        owner: "owner", 
        repo: "repo",
        provider: {
          type: "gitea",
          baseUrl: "https://git.example.com/api/v1",
        },
      };

      expect(getRepositoryCloneUrl(githubRepo)).toBe("https://github.com/owner/repo.git");
      expect(getRepositoryCloneUrl(giteaRepo)).toBe("https://git.example.com/owner/repo.git");
    });
  });
});