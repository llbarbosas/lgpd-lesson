import {
  AccessTokenData,
  Client,
  Injectable,
  notOk,
  ok,
  Result,
  UseCase,
  User,
} from "@lgpd-lesson/shared";
import {
  ClientRepository,
  AuthorizationScopeRepository,
  PasswordHasher,
  TokenSigner,
  OTPRequestRepository,
  UserRepository,
} from "src/core";
import { GenerateToken, AccessTokenResponse } from "./GenerateToken";

type requestType = "client_credentials" | "otp" | "code";

type RequestTokenClientCredentialsProperties = {
  clientId: Client["id"];
  clientSecret: string;
  scope: string;
};

@Injectable()
export class RequestTokenClientCredentials
  implements
    UseCase<
      RequestTokenClientCredentialsProperties,
      Promise<Result<AccessTokenResponse>>
    >
{
  constructor(
    private generateToken: GenerateToken,
    private authorizationScopeRepository: AuthorizationScopeRepository,
    private clientRepository: ClientRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(props: RequestTokenClientCredentialsProperties) {
    const { clientId, clientSecret } = props;

    const clientResult = await this.clientRepository.getOne({ id: clientId });

    if (clientResult.isNotOk()) {
      return notOk(new Error("Invalid client id"));
    }

    const secretIsValid = this.passwordHasher
      .compare(clientSecret, clientResult.value.id)
      .mapNotOk(() => false).value;

    if (!secretIsValid) {
      return notOk(new Error("Invalid client secret"));
    }

    const requestedScopesIds = props.scope.split(" ");

    const clientAvailableScopesResult =
      await this.authorizationScopeRepository.getClientInheritedScopes({
        inheritedFromScopeIds: requestedScopesIds,
      });

    if (clientAvailableScopesResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    return this.generateToken.execute({
      accessTokenData: {
        issuer: clientResult.value.id,
        scope: clientAvailableScopesResult.value,
      },
    });
  }
}

type RequestTokenOTPProperties = {
  otpMethod: "email";
  email: User["email"];
  otp: string;
  scope: string;
  accessTokenData: AccessTokenData;
};

@Injectable()
export class RequestTokenOTP
  implements
    UseCase<RequestTokenOTPProperties, Promise<Result<AccessTokenResponse>>>
{
  constructor(
    private generateToken: GenerateToken,
    private authorizationScopeRepository: AuthorizationScopeRepository,
    private otpRequestRepository: OTPRequestRepository,
    private userRepository: UserRepository
  ) {}

  async execute(props: RequestTokenOTPProperties) {
    const otpResult = await this.otpRequestRepository.getOne({
      otp: props.otp,
      email: props.email,
    });

    if (otpResult.isNotOk()) {
      return notOk(new Error("Invalid OTP code"));
    }

    const otpDeleteResult = await this.otpRequestRepository.getOne({
      otp: props.otp,
      email: props.email,
    });

    if (otpDeleteResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const userResult = await this.userRepository.getOne({ email: props.email });

    if (userResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const requestedScopesIds = props.scope.split(" ");

    const userAvailableScopesResult =
      await this.authorizationScopeRepository.getUserInheritedScopes({
        inheritedFromScopeIds: requestedScopesIds,
      });

    if (userAvailableScopesResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    return ok(
      this.generateToken.execute({
        accessTokenData: {
          issuer: props.accessTokenData.issuer,
          subject: userResult.value.id,
          scope: userAvailableScopesResult.value,
        },
      })
    );
  }
}

type RequestTokenAuthorizationCodeProperties = {
  code: string;
  codeVerifier: string;
  clientId: Client["id"];
  clientSecret: string;
  scope: string;
};

@Injectable()
export class RequestTokenAuthorizationCode
  implements
    UseCase<
      RequestTokenAuthorizationCodeProperties,
      Promise<Result<AccessTokenResponse>>
    >
{
  constructor(
    private generateToken: GenerateToken,
    private authorizationScopeRepository: AuthorizationScopeRepository,
    private otpRequestRepository: OTPRequestRepository,
    private userRepository: UserRepository,
    private clientRepository: ClientRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(props: RequestTokenAuthorizationCodeProperties) {
    return notOk(new Error("TODO"));
  }
}

type RequestTokenRefreshTokenProperties = {
  refreshToken: string;
  clientId: Client["id"];
  clientSecret: string;
  scope: string;
};

@Injectable()
export class RequestTokenRefreshToken
  implements
    UseCase<
      RequestTokenRefreshTokenProperties,
      Promise<Result<AccessTokenResponse>>
    >
{
  constructor(
    private generateToken: GenerateToken,
    private authorizationScopeRepository: AuthorizationScopeRepository,
    private otpRequestRepository: OTPRequestRepository,
    private userRepository: UserRepository,
    private clientRepository: ClientRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(props: RequestTokenRefreshTokenProperties) {
    return notOk(new Error("TODO"));
  }
}
