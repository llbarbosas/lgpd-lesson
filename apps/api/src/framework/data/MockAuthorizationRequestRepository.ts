import { notOk, ok, Result } from "@lgpd-lesson/shared";
import { AuthorizationRequest, AuthorizationRequestRepository } from "@core";
import { randomUUID } from "crypto";

export class MockAuthorizationRequestRepository
  implements AuthorizationRequestRepository
{
  constructor(
    private repositoryData: Record<
      AuthorizationRequest["id"],
      AuthorizationRequest
    > = {}
  ) {}

  async getOne(
    query: Pick<Partial<AuthorizationRequest>, "id" | "code">
  ): Promise<Result<AuthorizationRequest, Error>> {
    const authorizationRequest = query.id
      ? this.repositoryData[query.id]
      : Object.values(this.repositoryData).find(
          (data) => data.code === query.code
        );

    if (authorizationRequest === undefined) {
      return notOk(new Error("Authorization code not found"));
    }

    return ok(authorizationRequest);
  }

  async updateOne(
    query: Pick<Partial<AuthorizationRequest>, "id" | "code">,
    data: Partial<AuthorizationRequest>
  ): Promise<Result<AuthorizationRequest, Error>> {
    const authorizationRequest = query.id
      ? this.repositoryData[query.id]
      : Object.values(this.repositoryData).find(
          (data) => data.code === query.code
        );

    if (authorizationRequest === undefined) {
      return notOk(new Error("Authorization code not found"));
    }

    const updatedAuthorizationRequest = { ...authorizationRequest, ...data };

    this.repositoryData[authorizationRequest.id] = updatedAuthorizationRequest;

    return ok(updatedAuthorizationRequest);
  }

  async createOne(
    data: Omit<AuthorizationRequest, "id">
  ): Promise<Result<AuthorizationRequest, Error>> {
    const id = randomUUID();

    const authorizationRequest = { ...data, id };

    this.repositoryData[id] = authorizationRequest;

    return ok(authorizationRequest);
  }
}
