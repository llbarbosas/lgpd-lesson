import { Controller, Get, Post, Request, Response } from "@lgpd-lesson/shared";
import {
  GenerateToken,
  RequestAuthorization,
  RequestOTP,
  RequestTokenAuthorizationCode,
  RequestTokenClientCredentials,
  RequestTokenOTP,
  RequestTokenRefreshToken,
  RevokeToken,
} from "../../core";

@Controller("/auth")
export class AuthController {
  constructor(
    private _requestAuthorization: RequestAuthorization,
    private _requestOTP: RequestOTP,
    private _requestTokenAuthorizationCode: RequestTokenAuthorizationCode,
    private _requestTokenClientCredentials: RequestTokenClientCredentials,
    private _requestTokenOTP: RequestTokenOTP,
    private _requestTokenRefreshToken: RequestTokenRefreshToken,
    private _revokeToken: RevokeToken
  ) {}

  @Get("/authorize")
  async authorize(req: Request): Promise<Response> {
    const {
      refresh_token: refreshToken,
      client_id: clientId,
      state,
      scope,
      response_type: responseType,
      code_challenge_method: codeChallengeMethod,
    } = req.body;

    return Response.fromResultP(
      this._requestAuthorization.execute({
        refreshToken,
        clientId,
        state,
        scope,
        responseType,
        codeChallengeMethod,
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
        client_secret: clientSecret,
        scope,
      } = req.body;

      return Response.fromResultP(
        this._requestTokenAuthorizationCode.execute({
          code,
          codeVerifier,
          clientId,
          clientSecret,
          scope,
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
