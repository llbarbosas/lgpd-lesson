import { AccessTokenData, Result } from "@lgpd-lesson/shared";

export interface AccessTokenRepository {
  getOne(query: { jwtid: string }): Promise<Result<AccessTokenData>>;
  createOne(
    data: Omit<AccessTokenData, "jwtid">
  ): Promise<Result<AccessTokenData>>;
  deleteOne(query: { jwtid: string }): Promise<Result<AccessTokenData>>;
  updateOne(
    query: { jwtid: string },
    data: Partial<AccessTokenData>
  ): Promise<Result<AccessTokenData>>;
}
