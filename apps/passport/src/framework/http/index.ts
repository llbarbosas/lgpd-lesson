import {
  http as httpConfig,
  authentication as authenticationConfig,
} from "@config";
import { AuthController, PassportController } from "@application";
import {
  GenerateToken,
  InternalAuthorize,
  RequestAuthorization,
  RequestOTP,
  RequestTokenAuthorizationCode,
  RequestTokenClientCredentials,
  RequestTokenOTP,
  RequestTokenRefreshToken,
  RequestTokenResourceOwnerPassword,
  RevokeToken,
} from "@core";
import {
  MockAccessTokenRepository,
  MockAuthorizationRequestRepository,
  MockAuthorizationScopeRepository,
  MockClientRepository,
  MockOTPRequestRepository,
} from "@framework/data";
import {
  HtmlAuthorizationRequestViewBuilder,
  HtmlSignInViewBuilder,
} from "@framework/http/views";
import {
  MockUserRepository,
  NodeCryptoFunctions,
  JWTTokenSigner,
  MockMailer,
  ScryptPasswordHasher,
  Router,
  App,
  authentication as sharedAuthenticationConfig,
  fixtures,
} from "@lgpd-lesson/shared";
import { join } from "path";

export class HTTPServer {
  private app: App;

  constructor(private address: string = httpConfig.address) {
    const authorizationScopeRepository = new MockAuthorizationScopeRepository();
    const authorizationRequestRepository =
      new MockAuthorizationRequestRepository();
    const clientRepository = new MockClientRepository();
    const otpRequestRepository = new MockOTPRequestRepository();
    const userRepository = new MockUserRepository(fixtures.userRepositoryData);
    const accessTokenRepository = new MockAccessTokenRepository();

    const passwordHasher = new ScryptPasswordHasher(
      sharedAuthenticationConfig.hash_keylen
    );
    const cryptoFunctions = new NodeCryptoFunctions();
    const mailer = new MockMailer();
    const tokenSigner = new JWTTokenSigner(
      sharedAuthenticationConfig.jwtSecretOrPublicKey,
      authenticationConfig.jwtSecretOrPrivateKey
    );

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
      userRepository,
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
    const internalAuthorize = new InternalAuthorize(
      userRepository,
      authorizationRequestRepository,
      tokenSigner,
      passwordHasher,
      generateToken
    );

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
      internalAuthorize,
      authorizationRequestViewBuilder,
      signInViewBuilder
    );

    const passportController = new PassportController(
      userRepository,
      tokenSigner
    );

    const router = new Router([authController, passportController]);

    const publicFolderPath = join(__dirname, "public");

    this.app = new App(router, publicFolderPath);
  }

  listen() {
    this.app.listen(this.address);
  }
}
