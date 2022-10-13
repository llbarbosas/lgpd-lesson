import { AccessTokenData, AccessToken, Result } from "@lgpd-lesson/shared";

export interface TokenSigner {
  sign(data: Omit<AccessTokenData, "jwtid">): Result<AccessToken>;
  verify(token: AccessToken): Result<AccessTokenData>;
}
