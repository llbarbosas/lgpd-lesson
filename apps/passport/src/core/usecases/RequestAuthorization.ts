import {
  Client,
  UseCase,
  Result,
  notOk,
  ok,
  CryptoFunctions,
  ScopeInfo,
} from "@lgpd-lesson/shared";
import {
  AuthorizationRequestRepository,
  AuthorizationScopeRepository,
  ClientRepository,
} from "@core/data";
import { AuthorizationRequest } from "@core/entities";

type Properties = {
  audience: string;
  clientId: Client["id"];
  state?: string;
  scope: string;
  responseType: "code";
  codeChallengeMethod: "S256";
  codeChallenge: string;
};

export type AuthorizationRequestViewParams = AuthorizationRequest & {
  client: Client;
  scopesInfo: ScopeInfo[];
  authorizeRequestCallbackUri: string;
  denyRequestCallbackUri: string;
};

export class RequestAuthorization
  implements
    UseCase<Properties, Promise<Result<AuthorizationRequestViewParams>>>
{
  constructor(
    private authorizationScopeRepository: AuthorizationScopeRepository,
    private clientRepository: ClientRepository,
    private authorizationRequestRepository: AuthorizationRequestRepository,
    private cryptoFunctions: CryptoFunctions
  ) {}

  async execute(props: Properties) {
    const { clientId, responseType, codeChallengeMethod } = props;

    if (responseType !== "code") {
      return notOk(
        new Error(
          `O response_type "${responseType}" é inválido. Válidos: "code"`
        )
      );
    }

    if (codeChallengeMethod !== "S256") {
      return notOk(
        new Error(
          `O code_challenge_method "${codeChallengeMethod}" é inválido. Válidos: "S256"`
        )
      );
    }

    const clientResult = await this.clientRepository.getOne({ id: clientId });

    if (clientResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível encontrar o client", {
          cause: clientResult.value,
        })
      );
    }

    const desiredScopes = props.scope.split(" ");

    const inheritedScopesResult =
      await this.authorizationScopeRepository.getClientInheritedScopes({
        clientId,
        inheritedFromScopeIds: desiredScopes,
      });

    if (inheritedScopesResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível processar os scopes", {
          cause: inheritedScopesResult.value,
        })
      );
    }

    const codeResult = this.cryptoFunctions.generateRandomCode(20);

    if (codeResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível gerar o código", {
          cause: codeResult.value,
        })
      );
    }

    const registerAuthorizationRequestResult =
      await this.authorizationRequestRepository.createOne({
        audience: props.audience,
        clientId: props.clientId,
        state: props.state,
        scope: inheritedScopesResult.value.join(" "),
        responseType: props.responseType,
        codeChallengeMethod: props.codeChallengeMethod,
        codeChallenge: props.codeChallenge,
        code: codeResult.value,
      });

    if (registerAuthorizationRequestResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível registrar a solicitação", {
          cause: registerAuthorizationRequestResult.value,
        })
      );
    }

    const scopesInfoResult =
      await this.authorizationScopeRepository.getScopesInfo({
        scopeIds: inheritedScopesResult.value,
      });

    const scopesInfo = scopesInfoResult.mapNotOk(() => []).value;

    const sendCodeCallbackUri = new URL(clientResult.value.redirectUri);
    sendCodeCallbackUri.searchParams.append(
      "code",
      registerAuthorizationRequestResult.value.code
    );
    sendCodeCallbackUri.searchParams.append("state", props.state ?? "");
    sendCodeCallbackUri.searchParams.append(
      "scope",
      registerAuthorizationRequestResult.value.scope
    );

    const authorizeRequestCallbackUri = new URL(
      "http://localhost:3000/v1/auth/signin"
    );
    authorizeRequestCallbackUri.searchParams.append(
      "cb",
      sendCodeCallbackUri.toString()
    );
    authorizeRequestCallbackUri.searchParams.append(
      "signin_request_id",
      registerAuthorizationRequestResult.value.id
    );

    const denyRequestCallbackUri = new URL(clientResult.value.redirectUri);
    denyRequestCallbackUri.searchParams.append("error", "user_denied");
    denyRequestCallbackUri.searchParams.append("state", props.state ?? "");

    const viewParams = {
      ...registerAuthorizationRequestResult.value,
      client: clientResult.value,
      scopesInfo,
      authorizeRequestCallbackUri: authorizeRequestCallbackUri.toString(),
      denyRequestCallbackUri: denyRequestCallbackUri.toString(),
    };

    return ok(viewParams);
  }
}
