import { AccessTokenData, fromThrowable, Result } from "@lgpd-lesson/shared";
import { TokenSigner } from "@core";
import * as jwt from "jsonwebtoken";
import { authentication } from "@config";

export class MockTokenSigner implements TokenSigner {
  constructor(
    private jwtSecretOrPrivateKey = authentication.jwtSecretOrPrivateKey,
    private jwtSecretOrPublicKey = authentication.jwtSecretOrPublicKey
  ) {}

  sign(data: AccessTokenData): Result<string, Error> {
    return fromThrowable(() =>
      jwt.sign(AccessTokenData.toJWTClaims(data), this.jwtSecretOrPrivateKey)
    );
  }

  verify(token: string): Result<AccessTokenData, Error> {
    return fromThrowable(() =>
      AccessTokenData.fromJWTClaims(
        jwt.verify(token, this.jwtSecretOrPublicKey)
      )
    );
  }
}
