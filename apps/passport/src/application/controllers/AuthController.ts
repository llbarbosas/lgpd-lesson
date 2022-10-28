import { Controller, Get, Post, Request, Response } from "@lgpd-lesson/shared";
import {
  AuthorizationRequestRepository,
  GenerateToken,
  InternalAuthorize,
  RequestAuthorization,
  RequestOTP,
  RequestTokenAuthorizationCode,
  RequestTokenClientCredentials,
  RequestTokenOTP,
  RequestTokenRefreshToken,
  RequestTokenResourceOwnerPassword,
  RevokeToken,
  TokenSigner,
} from "@core";
import {
  AuthorizationRequestViewBuilder,
  SignInViewBuilder,
} from "@application/views";

@Controller("/auth")
export class AuthController {
  constructor(
    private _requestAuthorization: RequestAuthorization,
    private _requestOTP: RequestOTP,
    private _requestTokenAuthorizationCode: RequestTokenAuthorizationCode,
    private _requestTokenClientCredentials: RequestTokenClientCredentials,
    private _requestTokenOTP: RequestTokenOTP,
    private _requestTokenResourceOwnerPassword: RequestTokenResourceOwnerPassword,
    private _requestTokenRefreshToken: RequestTokenRefreshToken,
    private _revokeToken: RevokeToken,
    private _internalAuthorize: InternalAuthorize,
    private authorizationRequestViewBuilder: AuthorizationRequestViewBuilder,
    private signInViewBuilder: SignInViewBuilder
  ) {}

  @Get("/signin")
  async signInView(req: Request): Promise<Response> {
    return Response.html(
      this.signInViewBuilder.build({
        signInRequestId: req.query.signin_request_id as string,
      })
    );
  }

  @Get("/authorize")
  async authorize(req: Request): Promise<Response> {
    const {
      audience,
      client_id: clientId,
      state,
      scope,
      response_type: responseType,
      code_challenge_method: codeChallengeMethod,
      code_challenge: codeChallenge,
    } = req.query;

    const authorizationRequestResult = await this._requestAuthorization.execute(
      {
        audience: audience as string,
        clientId: clientId as string,
        state: state as string,
        scope: scope as string,
        responseType: responseType as any,
        codeChallengeMethod: codeChallengeMethod as any,
        codeChallenge: codeChallenge as string,
      }
    );

    if (authorizationRequestResult.isNotOk()) {
      return Response.serverError(authorizationRequestResult.value.message);
    }

    const authorizationRequestView = this.authorizationRequestViewBuilder.build(
      authorizationRequestResult.value
    );

    return Response.html(authorizationRequestView);
  }

  @Post("/authorize/internal")
  async internalAuthorize(req: Request): Promise<Response> {
    const { signin_request_id: signInRequestId } = req.body;
    const { authorization: authorizationHeader } = req.headers;

    return Response.fromResultP(
      this._internalAuthorize.execute({
        signInRequestId: signInRequestId as string,
        authorizationHeader: authorizationHeader as string,
      })
    );
  }

  @Post("/token")
  async requestToken(req: Request): Promise<Response> {
    const { grant_type: grantType } = req.body;

    if (grantType === "client_credentials") {
      const {
        client_id: clientId,
        client_secret: clientSecret,
        scope,
      } = req.body;

      return Response.fromResultP(
        this._requestTokenClientCredentials.execute({
          clientId,
          clientSecret,
          scope,
        })
      );
    }

    if (grantType === "otp") {
      const { otp_method: otpMethod, email, otp, scope } = req.body;

      return Response.fromResultP(
        this._requestTokenOTP.execute({
          otpMethod,
          email,
          otp,
          scope,
          accessTokenData: {} as any,
        })
      );
    }

    if (grantType === "code") {
      const {
        code,
        code_verifier: codeVerifier,
        client_id: clientId,
      } = req.body;

      return Response.fromResultP(
        this._requestTokenAuthorizationCode.execute({
          code,
          codeVerifier,
          clientId,
        })
      );
    }

    if (grantType === "refresh_token") {
      const {
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        scope,
      } = req.body;

      return Response.fromResultP(
        this._requestTokenRefreshToken.execute({
          refreshToken,
          clientId,
          clientSecret,
          scope,
        })
      );
    }

    if (grantType === "password") {
      const {
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
        audience,
        scope,
      } = req.body;

      return Response.fromResultP(
        this._requestTokenResourceOwnerPassword.execute({
          clientId,
          clientSecret,
          username,
          password,
          audience,
          scope,
        })
      );
    }

    return Response.serverError("Invalid grant type");
  }

  @Post("/revoke")
  async revokeToken(req: Request): Promise<Response> {
    return Response.fromResultP(this._revokeToken.execute({}));
  }

  @Post("/otp")
  async requestOtp(req: Request): Promise<Response> {
    const { email } = req.body;

    return Response.fromResultP(
      this._requestOTP.execute({
        email,
      })
    );
  }
}
