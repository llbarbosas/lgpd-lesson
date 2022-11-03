import { http as httpConfig } from "@config";
import { StudentProfileController } from "@application";
import {
  AccessStudentProfile,
  AuthorizeStudentProfileAccess,
  ListStudentProfiles,
  RequestStudentProfileAccess,
  SubmitStudentProfile,
} from "@core";
import { MockStudentProfileRepository } from "@framework/data";
import {
  NodeCryptoFunctions,
  MockMailer,
  ScryptPasswordHasher,
  MockUserRepository,
  App,
  Router,
  JWTTokenSigner,
  fixtures,
  authentication as sharedAuthenticationConfig,
} from "@lgpd-lesson/shared";
import { join } from "path";
import { HtmlAuthorizeStudentProfileAccessViewBuilder } from "./views";

export class HTTPServer {
  private app: App;

  constructor(private address: string = httpConfig.address) {
    const userRepository = new MockUserRepository(fixtures.userRepositoryData);
    const studentProfileRepository = new MockStudentProfileRepository();

    const passwordHasher = new ScryptPasswordHasher(
      sharedAuthenticationConfig.hash_keylen
    );
    const cryptoFunctions = new NodeCryptoFunctions();
    const mailer = new MockMailer();
    const tokenSigner = new JWTTokenSigner(
      sharedAuthenticationConfig.jwtSecretOrPublicKey
    );

    const accessStudentProfile = new AccessStudentProfile(
      studentProfileRepository,
      userRepository,
      cryptoFunctions,
      passwordHasher
    );
    const authorizeStudentProfileAccess = new AuthorizeStudentProfileAccess(
      studentProfileRepository,
      userRepository,
      cryptoFunctions
    );
    const requestStudentProfileAccess = new RequestStudentProfileAccess(
      studentProfileRepository,
      userRepository,
      mailer
    );
    const submitStudentProfile = new SubmitStudentProfile(
      studentProfileRepository,
      userRepository,
      passwordHasher,
      cryptoFunctions
    );
    const listStudentProfiles = new ListStudentProfiles(
      studentProfileRepository
    );

    const authorizeStudentProfileAccessViewBuilder =
      new HtmlAuthorizeStudentProfileAccessViewBuilder();

    const studentProfileController = new StudentProfileController(
      submitStudentProfile,
      requestStudentProfileAccess,
      authorizeStudentProfileAccess,
      accessStudentProfile,
      listStudentProfiles,
      authorizeStudentProfileAccessViewBuilder,
      tokenSigner
    );

    const router = new Router([studentProfileController]);

    const publicFolderPath = join(__dirname, "public");

    this.app = new App(router, publicFolderPath);
  }

  listen() {
    this.app.listen(this.address);
  }
}
