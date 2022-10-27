import { http as httpConfig } from "@config";
import { AuthController, StudentController } from "@application";
import {
  AccessStudentProfile,
  AuthorizeStudentProfileAccess,
  GenerateToken,
  RequestAuthorization,
  RequestOTP,
  RequestStudentProfileAccess,
  RequestTokenAuthorizationCode,
  RequestTokenClientCredentials,
  RequestTokenOTP,
  RequestTokenRefreshToken,
  RequestTokenResourceOwnerPassword,
  RevokeToken,
  SubmitStudentProfile,
} from "@core";
import {
  MockAccessTokenRepository,
  MockAuthorizationRequestRepository,
  MockAuthorizationScopeRepository,
  MockClientRepository,
  MockOTPRequestRepository,
  MockStudentProfileRepository,
  MockUserRepository,
} from "@framework/data";
import {
  NodeCryptoFunctions,
  MockMailer,
  ScryptPasswordHasher,
  JWTTokenSigner,
} from "@framework/providers";
import { App } from "./app";
import { Router } from "./router";
import {
  HtmlAuthorizationRequestViewBuilder,
  HtmlSignInViewBuilder,
} from "@framework/http/views";

export class HTTPServer {
  private app: App;

  constructor(private address: string = httpConfig.address) {
    const authorizationScopeRepository = new MockAuthorizationScopeRepository();
    const authorizationRequestRepository =
      new MockAuthorizationRequestRepository();
    const clientRepository = new MockClientRepository();
    const otpRequestRepository = new MockOTPRequestRepository();
    const userRepository = new MockUserRepository();
    const studentProfileRepository = new MockStudentProfileRepository();
    const accessTokenRepository = new MockAccessTokenRepository();

    const passwordHasher = new ScryptPasswordHasher();
    const cryptoFunctions = new NodeCryptoFunctions();
    const mailer = new MockMailer();
    const tokenSigner = new JWTTokenSigner();

    const generateToken = new GenerateToken(accessTokenRepository, tokenSigner);
    const requestAuthorization = new RequestAuthorization(
      authorizationScopeRepository,
      clientRepository,
      authorizationRequestRepository,
      cryptoFunctions
    );
    const requestOTP = new RequestOTP(otpRequestRepository, mailer);
    const requestTokenAuthorizationCode = new RequestTokenAuthorizationCode(
      generateToken,
      authorizationRequestRepository,
      cryptoFunctions
    );
    const requestTokenClientCredentials = new RequestTokenClientCredentials(
      generateToken,
      authorizationScopeRepository,
      clientRepository,
      passwordHasher
    );
    const requestTokenOTP = new RequestTokenOTP(
      generateToken,
      authorizationScopeRepository,
      otpRequestRepository,
      userRepository
    );
    const requestTokenResourceOwnerPassword =
      new RequestTokenResourceOwnerPassword(
        generateToken,
        authorizationScopeRepository,
        authorizationRequestRepository,
        userRepository,
        clientRepository,
        passwordHasher
      );
    const requestTokenRefreshToken = new RequestTokenRefreshToken(
      generateToken,
      authorizationScopeRepository,
      otpRequestRepository,
      userRepository,
      clientRepository,
      passwordHasher
    );

    const revokeToken = new RevokeToken();

    const authorizationRequestViewBuilder =
      new HtmlAuthorizationRequestViewBuilder();
    const signInViewBuilder = new HtmlSignInViewBuilder();

    const authController = new AuthController(
      requestAuthorization,
      requestOTP,
      requestTokenAuthorizationCode,
      requestTokenClientCredentials,
      requestTokenOTP,
      requestTokenResourceOwnerPassword,
      requestTokenRefreshToken,
      revokeToken,
      authorizationRequestViewBuilder,
      signInViewBuilder
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
      accessStudentProfile
    );

    const router = new Router(authController, studentController);

    this.app = new App(router);
  }

  listen() {
    this.app.listen(this.address);
  }
}
