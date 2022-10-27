import { notOk, ok, Result, UseCase } from "@lgpd-lesson/shared";
import { AccessTokenData } from "@lgpd-lesson/shared";
import { AccessTokenRepository } from "@core/data";
import { authentication } from "@config";
import { TokenSigner } from "@core/provider";

type Properties = {
  accessTokenData: Pick<AccessTokenData, "issuer" | "scope" | "subject">;
};

export class GenerateToken
  implements UseCase<Properties, Promise<Result<string>>>
{
  constructor(
    private accessTokenRepository: AccessTokenRepository,
    private tokenSigner: TokenSigner,
    private _tokenExpirationTime = authentication.tokenExpirationTime
  ) {}

  get tokenExpirationTime() {
    return this._tokenExpirationTime;
  }

  async execute(props: Properties) {
    const accessTokenData = {
      issuer: props.accessTokenData.issuer,
      scope: props.accessTokenData.scope,
      expiresIn: this.tokenExpirationTime,
      issuedAt: Date.now(),
      subject: props.accessTokenData.subject,
    };

    const createTokenResult = await this.accessTokenRepository.createOne(
      accessTokenData
    );

    if (createTokenResult.isNotOk()) {
      return notOk(new Error("Token sign failed"));
    }

    const tokenSignResult = this.tokenSigner.sign(createTokenResult.value);

    if (tokenSignResult.isNotOk()) {
      return notOk(new Error("Token sign failed"));
    }

    return ok(tokenSignResult.value);
  }
}
