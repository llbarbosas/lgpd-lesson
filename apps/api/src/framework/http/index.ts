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
  MockAuthorizationScopeRepository,
  MockClientRepository,
  MockOTPRequestRepository,
  MockStudentProfileRepository,
  MockUserRepository,
} from "@framework/data";
import {
  MockCryptoFunctions,
  MockMailer,
  MockPasswordHasher,
  MockTokenSigner,
} from "@framework/providers";
import { App } from "./app";
import { Router } from "./router";

export class HTTPServer {
  private app: App;

  constructor(private address: string = httpConfig.address) {
    const authorizationScopeRepository = new MockAuthorizationScopeRepository();
    const clientRepository = new MockClientRepository();
    const otpRequestRepository = new MockOTPRequestRepository();
    const userRepository = new MockUserRepository();
    const studentProfileRepository = new MockStudentProfileRepository();
    const accessTokenRepository = new MockAccessTokenRepository();

    const passwordHasher = new MockPasswordHasher();
    const cryptoFunctions = new MockCryptoFunctions();
    const mailer = new MockMailer();
    const tokenSigner = new MockTokenSigner();

    const generateToken = new GenerateToken(accessTokenRepository, tokenSigner);
    const requestAuthorization = new RequestAuthorization(
      generateToken,
      authorizationScopeRepository,
      clientRepository
    );
    const requestOTP = new RequestOTP(otpRequestRepository, mailer);
    const requestTokenAuthorizationCode = new RequestTokenAuthorizationCode(
      generateToken,
      authorizationScopeRepository,

      userRepository,
      clientRepository,
      passwordHasher
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

    const authController = new AuthController(
      requestAuthorization,
      requestOTP,
      requestTokenAuthorizationCode,
      requestTokenClientCredentials,
      requestTokenOTP,
      requestTokenResourceOwnerPassword,
      requestTokenRefreshToken,
      revokeToken
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
