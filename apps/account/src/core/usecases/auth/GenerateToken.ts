import {
  AccessTokenData,
  Injectable,
  ok,
  Result,
  UseCase,
} from "@lgpd-lesson/shared";

type Properties = {
  accessTokenData: Pick<AccessTokenData, "issuer" | "scope" | "subject">;
};

export type AccessTokenResponse = {};

@Injectable()
export class GenerateToken
  implements UseCase<Properties, Promise<Result<AccessTokenResponse>>>
{
  constructor() {}

  async execute(props: Properties) {
    return ok({});
  }
}
