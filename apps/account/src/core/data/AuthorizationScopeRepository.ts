import { Result } from "@lgpd-lesson/shared";

export interface AuthorizationScopeRepository {
  getClientInheritedScopes(query: {
    inheritedFromScopeIds: string[];
  }): Promise<Result<string[]>>;

  getUserInheritedScopes(query: {
    inheritedFromScopeIds: string[];
  }): Promise<Result<string[]>>;
}
