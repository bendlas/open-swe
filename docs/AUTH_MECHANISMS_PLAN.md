# Authentication Mechanisms Implementation Plan

This document outlines the plan for implementing provider-specific authentication mechanisms for self-hosted Git providers (Gitea/Forgejo) in Open SWE.

## Current State

Open SWE currently supports GitHub authentication through:
- GitHub OAuth Apps (for public repositories)
- GitHub App installations (for organization repositories)
- Personal Access Tokens (PATs)

## Requirements for Self-Hosted Providers

### Gitea Authentication Options
1. **Personal Access Tokens (PATs)** - Primary method
2. **OAuth2 Applications** - For delegated access
3. **Basic Authentication** - Username/password (less secure)
4. **SSH Keys** - For git operations (clone/push/pull)

### Forgejo Authentication Options
1. **Personal Access Tokens (PATs)** - Primary method (same as Gitea)
2. **OAuth2 Applications** - For delegated access
3. **Basic Authentication** - Username/password (less secure)
4. **SSH Keys** - For git operations (clone/push/pull)

## Implementation Plan

### Phase 1: Token-Based Authentication (Immediate)
- [x] Add API token configuration fields in UI
- [x] Store tokens securely in configuration
- [x] Pass tokens to MCP servers via environment variables
- [ ] Implement token validation for self-hosted providers
- [ ] Add token scopes documentation

### Phase 2: Enhanced Authentication Security
- [ ] Implement secure token storage (encryption at rest)
- [ ] Add token expiration handling
- [ ] Implement token refresh mechanisms
- [ ] Add audit logging for authentication events

### Phase 3: OAuth2 Integration
- [ ] Design OAuth2 flow for self-hosted providers
- [ ] Implement OAuth2 application registration guide
- [ ] Add OAuth2 callback handling
- [ ] Integrate with existing GitHub OAuth patterns

### Phase 4: SSH Key Management
- [ ] Add SSH key configuration interface
- [ ] Implement SSH key validation
- [ ] Handle SSH key authentication for git operations
- [ ] Support multiple SSH keys per provider

### Phase 5: Advanced Authentication Features
- [ ] Multi-factor authentication (MFA) support
- [ ] SAML/LDAP integration for enterprise instances
- [ ] Fine-grained permissions management
- [ ] Session management and timeout handling

## Implementation Details

### 1. Token-Based Authentication

#### Configuration Schema Extension
```typescript
interface GitProviderConfig {
  type: GitProvider;
  baseUrl?: string;
  apiToken?: string;
  tokenScopes?: string[];
  tokenExpiresAt?: Date;
}
```

#### Token Storage
- Store encrypted tokens in user configuration
- Use environment variables for MCP server communication
- Implement secure token retrieval mechanisms

#### Token Validation
```typescript
async function validateProviderToken(config: GitProviderConfig): Promise<boolean> {
  const apiUrl = getProviderApiBaseUrl(config);
  
  try {
    const response = await fetch(`${apiUrl}/user`, {
      headers: {
        'Authorization': `token ${config.apiToken}`,
        'Accept': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

### 2. OAuth2 Implementation

#### OAuth2 Flow
1. User initiates OAuth2 flow from settings
2. Redirect to provider's OAuth2 authorization endpoint
3. Provider redirects back with authorization code
4. Exchange code for access token
5. Store token securely and configure MCP servers

#### OAuth2 Configuration
```typescript
interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  authorizationUrl: string;
  tokenUrl: string;
}
```

### 3. SSH Key Management

#### SSH Key Configuration
```typescript
interface SSHKeyConfig {
  privateKeyPath: string;
  publicKey: string;
  passphrase?: string;
  keyType: 'rsa' | 'ed25519' | 'ecdsa';
}
```

#### Git Operation Integration
- Configure git to use appropriate SSH keys
- Handle SSH agent integration
- Support key-based authentication for clone/push operations

## Security Considerations

### Token Security
1. **Encryption**: Encrypt API tokens at rest using system keyring
2. **Scoping**: Use minimal required token scopes
3. **Rotation**: Implement token rotation workflows
4. **Validation**: Regular token validation and health checks

### OAuth2 Security
1. **PKCE**: Use Proof Key for Code Exchange for OAuth2 flows
2. **State Parameter**: Implement CSRF protection
3. **Secure Storage**: Store OAuth2 tokens securely
4. **Scope Validation**: Validate received scopes match requested

### SSH Security
1. **Key Management**: Secure SSH private key storage
2. **Passphrase Protection**: Support passphrase-protected keys
3. **Agent Integration**: Integrate with SSH agent when available
4. **Key Rotation**: Support SSH key rotation workflows

## Testing Strategy

### Unit Tests
- [ ] Token validation functions
- [ ] OAuth2 flow components
- [ ] SSH key configuration utilities
- [ ] Provider-specific authentication adapters

### Integration Tests
- [ ] End-to-end authentication flows
- [ ] MCP server authentication
- [ ] Git operation authentication
- [ ] Token refresh and expiration handling

### Security Tests
- [ ] Token encryption/decryption
- [ ] OAuth2 security parameters
- [ ] SSH key security validation
- [ ] Authentication bypass attempts

## Documentation Requirements

### User Documentation
- [ ] Token generation guides for each provider
- [ ] OAuth2 application setup instructions
- [ ] SSH key configuration guide
- [ ] Troubleshooting authentication issues

### Developer Documentation
- [ ] Authentication architecture overview
- [ ] Provider authentication adapter interfaces
- [ ] Security best practices
- [ ] Testing authentication components

## Deployment Considerations

### Environment Variables
- Secure handling of authentication credentials
- Environment-specific configuration
- Docker/container security considerations

### Configuration Management
- User-friendly configuration interfaces
- Backup and restore of authentication settings
- Migration between authentication methods

## Success Criteria

1. **Security**: All authentication methods follow security best practices
2. **Usability**: Simple setup process for common authentication scenarios
3. **Flexibility**: Support for various enterprise authentication requirements
4. **Compatibility**: Seamless integration with existing GitHub authentication
5. **Reliability**: Robust error handling and recovery mechanisms

## Timeline

- **Phase 1**: 1-2 weeks (token validation and security improvements)
- **Phase 2**: 2-3 weeks (enhanced security features)
- **Phase 3**: 3-4 weeks (OAuth2 integration)
- **Phase 4**: 2-3 weeks (SSH key management)
- **Phase 5**: 4-6 weeks (advanced features, as needed)

## Next Steps

1. Implement token validation for current implementation
2. Add comprehensive tests for authentication utilities
3. Enhance documentation with specific provider setup guides
4. Begin design work for OAuth2 integration
5. Gather user feedback on authentication requirements