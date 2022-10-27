import { AuthorizationRequest } from "@core/entities";
import { UseCase, Result, ok } from "@lgpd-lesson/shared";

type Properties = {
  userId: string;
  authorizationRequestCode: AuthorizationRequest["code"];
  redirectUri: string;
};

export class AuthorizeAuthorizationRequest
  implements UseCase<Properties, Promise<Result<{}>>>
{
  constructor() {}

  async execute(props: Properties) {
    return ok({});
  }
}
