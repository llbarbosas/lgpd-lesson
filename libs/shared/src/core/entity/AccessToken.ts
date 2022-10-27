import { Client, User } from "./";

export type JWT = string;

export type AccessToken = JWT;

export type AccessTokenData = {
  jwtid: string;
  issuer: Client["id"];
  scope: string[];
  expiresIn: number;
  issuedAt: number;
  subject?: User["id"];
};

export const AccessTokenData = {
  fromJWTClaims: ({
    jti: jwtid,
    iss: issuer,
    exp: expiresIn,
    iat: issuedAt,
    sub: subject,
    scope,
  }: any): AccessTokenData => ({
    jwtid,
    issuer,
    expiresIn,
    issuedAt,
    scope: scope.split(" "),
    subject,
  }),

  toJWTClaims: ({
    jwtid: jti,
    issuer: iss,
    expiresIn: exp,
    issuedAt: iat,
    subject: sub,
    scope,
  }: AccessTokenData) => ({
    jti,
    iss,
    exp,
    iat,
    sub,
    scope: scope.join(" "),
  }),
};
