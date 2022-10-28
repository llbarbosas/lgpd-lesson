import { AccessTokenData, AccessToken, Result } from "../../core";

export interface TokenSigner {
  sign(data: AccessTokenData): Result<AccessToken>;
  verify(token: AccessToken): Result<AccessTokenData>;
  fromAuthorizationHeader(
    authorizationHeader: string | string[] | undefined
  ): Result<AccessTokenData>;
}
