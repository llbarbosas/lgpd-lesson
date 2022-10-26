import { AccessTokenData, AccessToken, Result } from "@lgpd-lesson/shared";

export interface TokenSigner {
  sign(data: AccessTokenData): Result<AccessToken>;
  verify(token: AccessToken): Result<AccessTokenData>;
}
