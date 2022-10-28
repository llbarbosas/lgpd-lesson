import { Client, Result, User } from "@lgpd-lesson/shared";

export interface AuthorizationScopeRepository {
  getClientInheritedScopes(query: {
    clientId: Client["id"];
    inheritedFromScopeIds: string[];
  }): Promise<Result<string[]>>;

  getUserInheritedScopes(query: {
    userId: User["id"];
    inheritedFromScopeIds: string[];
  }): Promise<Result<string[]>>;
}
