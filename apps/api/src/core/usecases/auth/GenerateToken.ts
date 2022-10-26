import {
  AccessTokenData,
  notOk,
  ok,
  Result,
  UseCase,
} from "@lgpd-lesson/shared";
import { authentication } from "../../../config";
import { TokenSigner, CryptoFunctions } from "../../provider";

type Properties = {
  accessTokenData: Pick<AccessTokenData, "issuer" | "scope" | "subject">;
};

export class GenerateToken
  implements UseCase<Properties, Promise<Result<string>>>
{
  constructor(
    private tokenSigner: TokenSigner,
    private cryptoFunctions: CryptoFunctions,
    private _tokenExpirationTime = authentication.tokenExpirationTime
  ) {}

  get tokenExpirationTime() {
    return this._tokenExpirationTime;
  }

  async execute(props: Properties) {
    const tokenSignResult = this.tokenSigner.sign({
      jwtid: this.cryptoFunctions.generateUUID(),
      issuer: props.accessTokenData.issuer,
      scope: props.accessTokenData.scope,
      expiresIn: this.tokenExpirationTime,
      issuedAt: Date.now(),
      subject: props.accessTokenData.subject,
    });

    if (tokenSignResult.isNotOk()) {
      return notOk(new Error("Token sign failed"));
    }

    return ok(tokenSignResult.value);
  }
}
