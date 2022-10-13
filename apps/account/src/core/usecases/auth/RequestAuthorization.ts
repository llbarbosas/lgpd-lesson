import {
  Client,
  Injectable,
  UseCase,
  Result,
  notOk,
} from "@lgpd-lesson/shared";
import { AuthorizationScopeRepository, ClientRepository } from "src/core/data";
import { AccessTokenResponse, GenerateToken } from "./GenerateToken";

type Properties = {
  refreshToken: string;
  clientId: Client["id"];
  state: string;
  scope: string;
  responseType: "code";
  codeChallengeMethod: "S256";
};

@Injectable()
export class RequestAuthorization
  implements UseCase<Properties, Promise<Result<AccessTokenResponse>>>
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
