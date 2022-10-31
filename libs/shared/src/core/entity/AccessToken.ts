import { Client, User } from "./";

export type JWT = string;

export type AccessToken = JWT;

export type ScopeId = string;

export interface ScopeInfo {
  id: ScopeId;
  authorizationRequestIcon: string;
  authorizationRequestTitle: string;
  authorizationRequestDescription: string;
}

export type AccessTokenData = {
  jwtid: string;
  issuer: Client["id"];
  scope: ScopeId[];
  expiresIn: number;
  issuedAt: number;
  subject?: User["id"];

  username?: string;
  email?: string;
  cpf?: string;
  rga?: string;
  fullname?: string;
};

export const AccessTokenData = {
  fromJWTClaims: ({
    jti: jwtid,
    iss: issuer,
    exp: expiresIn,
    iat: issuedAt,
    sub: subject,
    scope,
    username,
    email,
    cpf,
    rga,
    fullname,
  }: any): AccessTokenData => ({
    jwtid,
    issuer,
    expiresIn,
    issuedAt,
    scope: scope.split(" "),
    subject,
    email,
    cpf,
    rga,
    fullname,
  }),

  toJWTClaims: ({
    jwtid: jti,
    issuer: iss,
    expiresIn: exp,
    issuedAt: iat,
    subject: sub,
    scope,
    username,
    email,
    cpf,
    rga,
    fullname,
  }: AccessTokenData) => ({
    jti,
    iss,
    exp,
    iat,
    sub,
    scope: scope.join(" "),
    username,
    email,
    cpf,
    rga,
    fullname,
  }),
};
