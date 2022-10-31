import { Client, Result, User, ScopeId, ScopeInfo } from "@lgpd-lesson/shared";

export interface AuthorizationScopeRepository {
  getClientInheritedScopes(query: {
    clientId: Client["id"];
    inheritedFromScopeIds: ScopeId[];
  }): Promise<Result<ScopeId[]>>;

  getUserInheritedScopes(query: {
    userId: User["id"];
    inheritedFromScopeIds: ScopeId[];
  }): Promise<Result<ScopeId[]>>;

  getScopesInfo(query: { scopeIds: ScopeId[] }): Promise<Result<ScopeInfo[]>>;
}
