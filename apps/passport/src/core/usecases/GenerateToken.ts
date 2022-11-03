import { notOk, ok, Result, UseCase, TokenSigner } from "@lgpd-lesson/shared";
import { AccessTokenData, authentication } from "@lgpd-lesson/shared";
import { AccessTokenRepository } from "@core/data";

type Properties = {
  accessTokenData: Omit<AccessTokenData, "expiresIn" | "issuedAt" | "jwtid">;
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
      ...props.accessTokenData,
      expiresIn: this.tokenExpirationTime,
      issuedAt: Date.now(),
    };

    const createTokenResult = await this.accessTokenRepository.createOne(
      accessTokenData
    );

    if (createTokenResult.isNotOk()) {
      return notOk(new Error("Não foi possível registrar o token"));
    }

    const tokenSignResult = this.tokenSigner.sign(createTokenResult.value);

    if (tokenSignResult.isNotOk()) {
      return notOk(new Error("Não foi possível assinar o token"));
    }

    return ok(tokenSignResult.value);
  }
}
