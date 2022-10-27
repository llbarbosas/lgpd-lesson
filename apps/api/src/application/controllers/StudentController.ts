import { Controller, Get, Post, Request, Response } from "@lgpd-lesson/shared";
import {
  AccessStudentProfile,
  AuthorizeStudentProfileAccess,
  RequestStudentProfileAccess,
  SubmitStudentProfile,
} from "@core";

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
    const { student_profile: studentProfile, username, password } = req.body;

    return Response.fromResultP(
      this._submitStudentProfile.execute({
        studentProfile,
        username,
        password,
      })
    );
  }

  @Post("/access_request")
  async requestStudentProfileAccess(req: Request): Promise<Response> {
    const {
      student_profile_id: studentProfileId,
      user_id: userId,
      usage_intention: usageIntention,
    } = req.body;

    return Response.fromResultP(
      this._requestStudentProfileAccess.execute({
        studentProfileId,
        userId,
        usageIntention,
      })
    );
  }

  @Post("/access_request/authorize")
  async authorizeStudentProfileAccess(req: Request): Promise<Response> {
    const {
      student_profile_id: studentProfileId,
      username,
      password,
    } = req.body;

    return Response.fromResultP(
      this._authorizeStudentProfileAccess.execute({
        studentProfileId,
        username,
        password,
      })
    );
  }

  @Get("/")
  async accessStudentProfile(req: Request): Promise<Response> {
    const {
      student_profile_id: studentProfileId,
      username,
      password,
    } = req.body;

    return Response.fromResultP(
      this._accessStudentProfile.execute({
        studentProfileId,
        username,
        password,
      })
    );
  }
}
