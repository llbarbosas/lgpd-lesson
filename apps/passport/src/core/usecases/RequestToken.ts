import {
  AccessTokenData,
  Client,
  notOk,
  ok,
  Result,
  UseCase,
  User,
  CryptoFunctions,
  PasswordHasher,
  UserRepository,
} from "@lgpd-lesson/shared";
import {
  ClientRepository,
  AuthorizationScopeRepository,
  OTPRequestRepository,
  AuthorizationRequestRepository,
} from "@core/data";
import { GenerateToken } from "./GenerateToken";

type RequestTokenClientCredentialsProperties = {
  clientId: Client["id"];
  clientSecret: string;
  scope: string;
};

type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
};

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
      .compare(clientSecret, clientResult.value.secret)
      .mapNotOk(() => false).value;

    if (!secretIsValid) {
      return notOk(new Error("Invalid client secret"));
    }

    const requestedScopesIds = props.scope.split(" ");

    const clientAvailableScopesResult =
      await this.authorizationScopeRepository.getClientInheritedScopes({
        clientId,
        inheritedFromScopeIds: requestedScopesIds,
      });

    if (clientAvailableScopesResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const generateTokenResult = await this.generateToken.execute({
      accessTokenData: {
        issuer: clientResult.value.id,
        scope: clientAvailableScopesResult.value,
      },
    });

    if (generateTokenResult.isNotOk()) {
      return generateTokenResult;
    }

    return ok({
      access_token: generateTokenResult.value,
      expires_in: this.generateToken.tokenExpirationTime,
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

    const userResult = await this.userRepository.getOne({ email: props.email });

    if (userResult.isNotOk()) {
      return notOk(userResult.value);
    }

    const requestedScopesIds = props.scope.split(" ");

    const userAvailableScopesResult =
      await this.authorizationScopeRepository.getUserInheritedScopes({
        userId: userResult.value.id,
        inheritedFromScopeIds: requestedScopesIds,
      });

    if (userAvailableScopesResult.isNotOk()) {
      return notOk(userAvailableScopesResult.value);
    }

    const tokenSignResult = await this.generateToken.execute({
      accessTokenData: {
        issuer: props.accessTokenData.issuer,
        subject: userResult.value.id,
        scope: userAvailableScopesResult.value,
      },
    });

    if (tokenSignResult.isNotOk()) {
      return tokenSignResult;
    }

    const otpDeleteResult = await this.otpRequestRepository.deleteOne({
      otp: props.otp,
    });

    if (otpDeleteResult.isNotOk()) {
      return notOk(otpDeleteResult.value);
    }

    return ok({
      access_token: tokenSignResult.value,
      expires_in: this.generateToken.tokenExpirationTime,
    });
  }
}

type RequestTokenAuthorizationCodeProperties = {
  code: string;
  codeVerifier: string;
  clientId: Client["id"];
};

export class RequestTokenAuthorizationCode
  implements
    UseCase<
      RequestTokenAuthorizationCodeProperties,
      Promise<Result<AccessTokenResponse>>
    >
{
  constructor(
    private generateToken: GenerateToken,
    private authorizationRequestRepository: AuthorizationRequestRepository,
    private cryptoFunctions: CryptoFunctions
  ) {}

  async execute(props: RequestTokenAuthorizationCodeProperties) {
    const authorizationRequestResult =
      await this.authorizationRequestRepository.getOne({
        code: props.code,
      });

    if (authorizationRequestResult.isNotOk()) {
      return notOk(
        new Error("Cannot find authorization request", {
          cause: authorizationRequestResult.value,
        })
      );
    }

    const {
      value: { codeChallenge, authorizerUserId, clientId, scope },
    } = authorizationRequestResult;

    if (authorizerUserId === undefined) {
      return notOk(new Error("There's a problem with user authorization"));
    }

    const codeVerifierHashResult = this.cryptoFunctions.createSha256Hash(
      props.codeVerifier,
      "base64url"
    );

    if (codeVerifierHashResult.isNotOk()) {
      return notOk(
        new Error("Server error", { cause: codeVerifierHashResult.value })
      );
    }

    const codeChallengeMatch = codeVerifierHashResult.value === codeChallenge;

    if (!codeChallengeMatch) {
      return notOk(new Error("Code verifier dont match challenge"));
    }

    const generateTokenResult = await this.generateToken.execute({
      accessTokenData: {
        issuer: clientId,
        subject: authorizerUserId,
        scope: scope.split(" "),
      },
    });

    if (generateTokenResult.isNotOk()) {
      return generateTokenResult;
    }

    return ok({
      access_token: generateTokenResult.value,
      expires_in: this.generateToken.tokenExpirationTime,
    });
  }
}

type RequestTokenResourceOwnerPasswordProperties = {
  clientId: Client["id"];
  clientSecret: string;
  audience?: string;
  username: User["username"];
  password: string;
  scope: string;
};

export class RequestTokenResourceOwnerPassword
  implements
    UseCase<
      RequestTokenResourceOwnerPasswordProperties,
      Promise<Result<AccessTokenResponse>>
    >
{
  constructor(
    private generateToken: GenerateToken,
    private authorizationScopeRepository: AuthorizationScopeRepository,
    private authorizationRequestRepository: AuthorizationRequestRepository,
    private userRepository: UserRepository,
    private clientRepository: ClientRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(props: RequestTokenResourceOwnerPasswordProperties) {
    const { username, password, clientId } = props;

    const userResult = await this.userRepository.getOne({ username });

    if (userResult.isNotOk()) {
      return notOk(new Error("Invalid user credentials"));
    }

    const secretIsValid = this.passwordHasher
      .compare(password, userResult.value.password)
      .mapNotOk(() => false).value;

    if (!secretIsValid) {
      return notOk(new Error("Invalid user credentials"));
    }

    const requestedScopesIds = props.scope.split(" ");

    const userAvailableScopesResult =
      await this.authorizationScopeRepository.getUserInheritedScopes({
        userId: userResult.value.id,
        inheritedFromScopeIds: requestedScopesIds,
      });

    if (userAvailableScopesResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const generateTokenResult = await this.generateToken.execute({
      accessTokenData: {
        issuer: clientId,
        subject: userResult.value.id,
        scope: userAvailableScopesResult.value,
      },
    });

    if (generateTokenResult.isNotOk()) {
      return generateTokenResult;
    }

    return ok({
      access_token: generateTokenResult.value,
      expires_in: this.generateToken.tokenExpirationTime,
    });
  }
}

type RequestTokenRefreshTokenProperties = {
  refreshToken: string;
  clientId: Client["id"];
  clientSecret: string;
  scope: string;
};

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
