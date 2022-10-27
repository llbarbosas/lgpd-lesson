import { Client, UseCase, Result, notOk } from "@lgpd-lesson/shared";
import { AuthorizationScopeRepository, ClientRepository } from "@core/data";
import { GenerateToken } from "./GenerateToken";

type Properties = {
  refreshToken: string;
  clientId: Client["id"];
  state?: string;
  scope: string;
  responseType: "code";
  codeChallengeMethod: "S256";
};

export class RequestAuthorization
  implements UseCase<Properties, Promise<Result<{}>>>
{
  constructor(
    private generateToken: GenerateToken,
    private authorizationScopeRepository: AuthorizationScopeRepository,
    private clientRepository: ClientRepository
  ) {}

  async execute(props: Properties) {
    return notOk(new Error("TODO"));
  }
}
