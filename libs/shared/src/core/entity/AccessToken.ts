import { Client } from "./Client";
import { User } from "./User";

export type JWT = string;

export type AccessToken = JWT;

export class AccessTokenData {
  constructor(
    public jwtid: string,
    public issuer: Client["id"],
    public scope: string[],
    public expiresIn: number,
    public issuedAt: number,
    public subject?: User["id"]
  ) {}

  fromJWTClaims({
    jti: jwtid,
    iss: issuer,
    exp: expiresIn,
    iat: issuedAt,
    sub: subject,
    scope,
  }: any): AccessTokenData {
    return new AccessTokenData(
      jwtid,
      issuer,
      expiresIn,
      issuedAt,
      scope.split(" "),
      subject
    );
  }
}
