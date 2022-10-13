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
} from "src/core";

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
    return Response.fromResultP(this._requestAuthorization.execute({}));
  }

  @Post("/token")
  async requestToken(req: Request): Promise<Response> {
    const { grant_type: grantType } = req.body;

    if (grantType === "client_credentials") {
      return Response.fromResultP(
        this._requestTokenClientCredentials.execute({})
      );
    }

    if (grantType === "otp") {
      return Response.fromResultP(this._requestTokenOTP.execute({}));
    }

    if (grantType === "code") {
      return Response.fromResultP(
        this._requestTokenAuthorizationCode.execute({})
      );
    }

    if (grantType === "refresh_token") {
      return Response.fromResultP(this._requestTokenRefreshToken.execute({}));
    }

    return Response.serverError("Invalid grant type");
  }

  @Post("/revoke")
  async revokeToken(req: Request): Promise<Response> {
    return Response.fromResultP(this._revokeToken.execute({}));
  }

  @Post("/otp")
  async requestOtp(req: Request): Promise<Response> {
    return Response.fromResultP(this._requestOTP.execute({}));
  }
}
