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
import { AuthorizeStudentProfileAccessViewBuilder } from "@application/views";

@Controller("/profiles")
export class StudentProfileController {
  constructor(
    private _submitStudentProfile: SubmitStudentProfile,
    private _requestStudentProfileAccess: RequestStudentProfileAccess,
    private _authorizeStudentProfileAccess: AuthorizeStudentProfileAccess,
    private _accessStudentProfile: AccessStudentProfile,
    private _listStudentProfiles: ListStudentProfiles,
    private authorizeStudentProfileAccessViewBuilder: AuthorizeStudentProfileAccessViewBuilder,
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
      return Response.badRequest("Um token de acesso de usuário é necessário");
    }

    return Response.fromResultP(
      this._listStudentProfiles.execute({
        accessTokenData: accessTokenResult.value,
      })
    );
  }

  @Get("/:student_profile_id")
  async accessStudentProfile(req: Request): Promise<Response> {
    const { student_profile_id: studentProfileId } = req.params;
    const { authorization: authorizationHeader, password } = req.headers;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    if (accessTokenResult.value.subject === undefined) {
      return Response.badRequest("Um token de acesso de usuário é necessário");
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
      return Response.badRequest("Um token de acesso de usuário é necessário");
    }

    return Response.fromResultP(
      this._submitStudentProfile.execute({
        studentProfile,
        userId: accessTokenResult.value.subject,
        password,
      })
    );
  }

  @Post("/request_access")
  async requestStudentProfileAccess(req: Request): Promise<Response> {
    const {
      username: studentProfileUsername,
      usage_intention: usageIntention,
    } = req.body;
    const { authorization: authorizationHeader } = req.headers;

    const accessTokenResult =
      this.tokenSigner.fromAuthorizationHeader(authorizationHeader);

    if (accessTokenResult.isNotOk()) {
      return Response.badRequest(accessTokenResult.value.message);
    }

    if (accessTokenResult.value.subject === undefined) {
      return Response.badRequest("Um token de acesso de usuário é necessário");
    }

    return Response.fromResultP(
      this._requestStudentProfileAccess.execute({
        studentProfileUsername,
        userId: accessTokenResult.value.subject,
        usageIntention,
      })
    );
  }

  @Get("/:student_profile_id/authorize")
  async authorizeStudentProfileAccessView(req: Request): Promise<Response> {
    const { student_profile_id: studentProfileId } = req.params;
    const { user_id: userId } = req.query;

    return Response.html(
      this.authorizeStudentProfileAccessViewBuilder.build({
        studentProfileId: studentProfileId as string,
        userId: userId as string,
      })
    );
  }

  @Post("/:student_profile_id/authorize")
  async authorizeStudentProfileAccess(req: Request): Promise<Response> {
    const { student_profile_id: studentProfileId } = req.params;
    const { user_id: userId } = req.query;
    const { password } = req.headers;

    return Response.fromResultP(
      this._authorizeStudentProfileAccess.execute({
        studentProfileId: studentProfileId as string,
        userId: userId as string,
        password: password as string,
      })
    );
  }
}
