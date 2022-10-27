import { Client, User } from "@lgpd-lesson/shared";

export interface AuthorizationRequest {
  id: string;
  audience: string;
  clientId: Client["id"];
  state?: string;
  scope: string;
  responseType: "code";
  codeChallengeMethod: "S256";
  codeChallenge: string;
  code: string;

  authorizerUserId?: User["id"];
}
