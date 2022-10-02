import { Controller, Get, Post, Request, Response } from "@lgpd/shared";

@Controller("/auth")
export class AuthController {
  @Get("/authorize")
  async authorize(req: Request): Promise<Response> {
    return Response.serverError("TODO");
  }

  @Post("/token")
  async getToken(req: Request): Promise<Response> {
    return Response.serverError("TODO");
  }

  @Post("/revoke")
  async revokeToken(req: Request): Promise<Response> {
    return Response.serverError("TODO");
  }

  @Post("/otp")
  async otpRequest(req: Request): Promise<Response> {
    return Response.serverError("TODO");
  }
}
