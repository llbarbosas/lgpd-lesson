import {
  Controller,
  Get,
  TokenSigner,
  UserRepository,
  Request,
  Response,
} from "@lgpd-lesson/shared";

@Controller("/passports")
export class PassportController {
  constructor(
    private userRepository: UserRepository,
    private tokenSigner: TokenSigner
  ) {}

  @Get("/:id")
  async getPassportInfo(req: Request): Promise<Response> {
    const { authorization: authorizationHeader } = req.headers;
    const { id: userId } = req.params;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    const { value: accessTokenData } = accessTokenResult;

    if (accessTokenData.subject === undefined) {
      return Response.badRequest("Um token de acesso de usuário é necessário");
    }

    if (!accessTokenData.scope.includes("passport")) {
      return Response.badRequest(
        'Permissões insuficientes no token. Scope necesário: "passport"'
      );
    }

    const userResult = await this.userRepository.getOne({ id: userId });

    if (userResult.isNotOk()) {
      return Response.serverError(userResult.value.message);
    }

    const { id, username, email } = userResult.value;

    return Response.ok({
      id,
      username,
      email,
    });
  }
}
