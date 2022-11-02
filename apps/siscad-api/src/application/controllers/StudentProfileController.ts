import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  TokenSigner,
} from "@lgpd-lesson/shared";
import {
  AccessStudentProfile,
  AuthorizeStudentProfileAccess,
  ListStudentProfiles,
  RequestStudentProfileAccess,
  SubmitStudentProfile,
} from "@core";
import { fixtures } from "@config";

@Controller("/profiles")
export class StudentProfileController {
  constructor(
    private _submitStudentProfile: SubmitStudentProfile,
    private _requestStudentProfileAccess: RequestStudentProfileAccess,
    private _authorizeStudentProfileAccess: AuthorizeStudentProfileAccess,
    private _accessStudentProfile: AccessStudentProfile,
    private _listStudentProfiles: ListStudentProfiles,
    private tokenSigner: TokenSigner
  ) {}

  @Get("/fields")
  async getProfileFields(_: Request): Promise<Response> {
    return Response.ok(fixtures.studentProfileFields);
  }

  @Get("/")
  async listStudentProfiles(req: Request): Promise<Response> {
    const { authorization: authorizationHeader } = req.headers;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    if (accessTokenResult.value.subject === undefined) {
      return Response.badRequest("User access token needed");
    }

    return Response.fromResultP(
      this._listStudentProfiles.execute({
        accessTokenData: accessTokenResult.value,
      })
    );
  }

  @Get("/:id")
  async accessStudentProfile(req: Request): Promise<Response> {
    const { id: studentProfileId } = req.params;
    const { authorization: authorizationHeader, password } = req.headers;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    if (accessTokenResult.value.subject === undefined) {
      return Response.badRequest("User access token needed");
    }

    return Response.fromResultP(
      this._accessStudentProfile.execute({
        studentProfileId: studentProfileId as string,
        userId: accessTokenResult.value.subject,
        password: password as string,
      })
    );
  }

  @Post("/")
  async submitStudentProfile(req: Request): Promise<Response> {
    const { student_profile: studentProfile, password } = req.body;
    const { authorization: authorizationHeader } = req.headers;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    if (accessTokenResult.value.subject === undefined) {
      return Response.badRequest("User access token needed");
    }

    return Response.fromResultP(
      this._submitStudentProfile.execute({
        studentProfile,
        userId: accessTokenResult.value.subject,
        password,
      })
    );
  }

  @Post("/access_request")
  async requestStudentProfileAccess(req: Request): Promise<Response> {
    const {
      student_profile_id: studentProfileId,
      usage_intention: usageIntention,
    } = req.body;
    const { authorization: authorizationHeader } = req.headers;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    if (accessTokenResult.value.subject === undefined) {
      return Response.badRequest("User access token needed");
    }

    return Response.fromResultP(
      this._requestStudentProfileAccess.execute({
        studentProfileId,
        userId: accessTokenResult.value.subject,
        usageIntention,
      })
    );
  }

  @Post("/access_request/authorize")
  async authorizeStudentProfileAccess(req: Request): Promise<Response> {
    const { student_profile_id: studentProfileId, password } = req.body;
    const { authorization: authorizationHeader } = req.headers;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    if (accessTokenResult.value.subject === undefined) {
      return Response.badRequest("User access token needed");
    }

    return Response.fromResultP(
      this._authorizeStudentProfileAccess.execute({
        studentProfileId,
        userId: accessTokenResult.value.subject,
        password,
      })
    );
  }
}
