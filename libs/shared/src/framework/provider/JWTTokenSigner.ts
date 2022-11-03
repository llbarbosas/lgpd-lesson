import {
  AccessTokenData,
  fromThrowable,
  notOk,
  Result,
  TokenSigner,
} from "../../core";
import * as jwt from "jsonwebtoken";

export type Secret =
  | string
  | Buffer
  | { key: string | Buffer; passphrase: string };

export class JWTTokenSigner implements TokenSigner {
  constructor(
    private jwtSecretOrPublicKey: Secret,
    private jwtSecretOrPrivateKey?: Secret
  ) {}
  fromAuthorizationHeader(
    authorizationHeader: string | string[] | undefined
  ): Result<AccessTokenData, Error> {
    if (typeof authorizationHeader !== "string") {
      return notOk(new Error('O tipo do header "Authorization" é inválido'));
    }

    const authorizationHeaderParts = authorizationHeader.split(" ");

    if (authorizationHeaderParts.length !== 2) {
      return notOk(new Error('O formato do header "Authorization" é inválido'));
    }

    if (authorizationHeaderParts[0] !== "Bearer") {
      return notOk(
        new Error(
          'O tipo do header "Authorization" é inválido. Válidos: "Bearer"'
        )
      );
    }

    return this.verify(authorizationHeaderParts[1]);
  }

  sign(data: AccessTokenData): Result<string, Error> {
    if (this.jwtSecretOrPrivateKey === undefined) {
      return notOk(
        new Error("jwtSecretOrPrivateKey é necessária para assinar tokens")
      );
    }

    const jwtSecretOrPrivateKey = this.jwtSecretOrPrivateKey;

    return fromThrowable(() =>
      jwt.sign(AccessTokenData.toJWTClaims(data), jwtSecretOrPrivateKey)
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
