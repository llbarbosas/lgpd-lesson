import { Client, notOk, ok, Result, User, fixtures } from "@lgpd-lesson/shared";
import { AuthorizationScopeRepository } from "@core";

export class MockAuthorizationScopeRepository
  implements AuthorizationScopeRepository
{
  constructor(
    private repositoryData = fixtures.authorizationScopeRepositoryData
  ) {}

  async getClientInheritedScopes(query: {
    clientId: Client["id"];
    inheritedFromScopeIds: string[];
  }): Promise<Result<string[], Error>> {
    const clientScopes = this.repositoryData.client[query.clientId];

    if (clientScopes === undefined) {
      return notOk(new Error("Client not found"));
    }

    const inheritedScopes = clientScopes.flatMap((scope) =>
      this.repositoryData.scopesClosureTree
        .filter(
          ([ancestor]) =>
            scope === ancestor && query.inheritedFromScopeIds.includes(scope)
        )
        .map(([_, descendant]) => descendant)
    );

    return ok(inheritedScopes);
  }

  async getUserInheritedScopes(query: {
    userId: User["id"];
    inheritedFromScopeIds: string[];
  }): Promise<Result<string[], Error>> {
    const userScopes = this.repositoryData.user[query.userId];

    if (userScopes === undefined) {
      return notOk(new Error("User not found"));
    }

    const inheritedScopes = userScopes.flatMap((scope) =>
      this.repositoryData.scopesClosureTree
        .filter(
          ([ancestor]) =>
            scope === ancestor && query.inheritedFromScopeIds.includes(scope)
        )
        .map(([_, descendant]) => descendant)
    );

    return ok(inheritedScopes);
  }
}
