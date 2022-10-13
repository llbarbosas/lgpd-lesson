import { Controller, Get, Post, Request, Response } from "@lgpd-lesson/shared";
import {
  AccessStudentProfile,
  AuthorizeStudentProfileAccess,
  RequestStudentProfileAccess,
  SubmitStudentProfile,
} from "src/core";

@Controller("/profiles")
export class StudentController {
  constructor(
    private _submitStudentProfile: SubmitStudentProfile,
    private _requestStudentProfileAccess: RequestStudentProfileAccess,
    private _authorizeStudentProfileAccess: AuthorizeStudentProfileAccess,
    private _accessStudentProfile: AccessStudentProfile
  ) {}

  @Post("/")
  async submitStudentProfile(req: Request): Promise<Response> {
    return Response.fromResultP(this._submitStudentProfile.execute({}));
  }

  @Post("/access_request")
  async requestStudentProfileAccess(req: Request): Promise<Response> {
    return Response.fromResultP(this._requestStudentProfileAccess.execute({}));
  }

  @Post("/access_request/authorize")
  async authorizeStudentProfileAccess(req: Request): Promise<Response> {
    return Response.fromResultP(
      this._authorizeStudentProfileAccess.execute({})
    );
  }

  @Get("/")
  async accessStudentProfile(req: Request): Promise<Response> {
    return Response.fromResultP(this._accessStudentProfile.execute({}));
  }
}
