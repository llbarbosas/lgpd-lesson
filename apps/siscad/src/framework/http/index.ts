import { fixtures, http as httpConfig, authentication } from "@config";
import { StudentController } from "@application";
import {
  AccessStudentProfile,
  AuthorizeStudentProfileAccess,
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
} from "@lgpd-lesson/shared";
import { join } from "path";

export class HTTPServer {
  private app: App;

  constructor(private address: string = httpConfig.address) {
    const userRepository = new MockUserRepository(fixtures.userRepositoryData);
    const studentProfileRepository = new MockStudentProfileRepository();

    const passwordHasher = new ScryptPasswordHasher(authentication.hash_keylen);
    const cryptoFunctions = new NodeCryptoFunctions();
    const mailer = new MockMailer();
    const tokenSigner = new JWTTokenSigner(authentication.jwtSecretOrPublicKey);

    const accessStudentProfile = new AccessStudentProfile(
      studentProfileRepository,
      userRepository,
      cryptoFunctions,
      passwordHasher
    );
    const authorizeStudentProfileAccess = new AuthorizeStudentProfileAccess(
      studentProfileRepository,
      userRepository,
      cryptoFunctions,
      passwordHasher
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

    const studentController = new StudentController(
      submitStudentProfile,
      requestStudentProfileAccess,
      authorizeStudentProfileAccess,
      accessStudentProfile,
      tokenSigner
    );

    const router = new Router([studentController]);

    const publicFolderPath = join(__dirname, "public");

    this.app = new App(router, publicFolderPath);
  }

  listen() {
    this.app.listen(this.address);
  }
}
