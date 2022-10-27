import { Result, AccessTokenData, notOk, ok } from "@lgpd-lesson/shared";
import { AccessTokenRepository } from "@core";
import { randomUUID } from "crypto";

export class MockAccessTokenRepository implements AccessTokenRepository {
  constructor(
    private repositoryData: Record<
      AccessTokenData["jwtid"],
      AccessTokenData
    > = {}
  ) {}

  async getOne(query: {
    jwtid: string;
  }): Promise<Result<AccessTokenData, Error>> {
    const accessTokenData = this.repositoryData[query.jwtid];

    if (accessTokenData === undefined) {
      return notOk(new Error("Access token not found"));
    }

    return ok(accessTokenData);
  }

  async createOne(
    data: Omit<AccessTokenData, "jwtid">
  ): Promise<Result<AccessTokenData, Error>> {
    const jwtid = randomUUID();

    const accessTokenData = { ...data, jwtid };

    this.repositoryData[jwtid] = accessTokenData;

    return ok(accessTokenData);
  }

  async deleteOne(query: {
    jwtid: string;
  }): Promise<Result<AccessTokenData, Error>> {
    const accessTokenData = this.repositoryData[query.jwtid];

    if (accessTokenData === undefined) {
      return notOk(new Error("Access token not found"));
    }

    delete this.repositoryData[query.jwtid];

    return ok(accessTokenData);
  }

  async updateOne(
    query: { jwtid: string },
    data: Partial<AccessTokenData>
  ): Promise<Result<AccessTokenData, Error>> {
    const accessTokenData = this.repositoryData[query.jwtid];

    if (accessTokenData === undefined) {
      return notOk(new Error("Access token not found"));
    }

    const updatedAccessTokenData = { ...accessTokenData, ...data };
    this.repositoryData[query.jwtid] = updatedAccessTokenData;

    return ok(updatedAccessTokenData);
  }
}
