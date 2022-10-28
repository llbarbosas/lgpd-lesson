import { AuthorizationRequestRepository } from "@core/data";
import {
  UseCase,
  Result,
  ok,
  notOk,
  User,
  UserRepository,
  PasswordHasher,
  TokenSigner,
} from "@lgpd-lesson/shared";
import { GenerateToken } from "./GenerateToken";

type Properties = {
  signInRequestId: string;
  authorizationHeader: string;
};

export class InternalAuthorize
  implements
    UseCase<
      Properties,
      Promise<Result<{ error?: true; accessToken?: string }>>
    >
{
  constructor(
    private userRepository: UserRepository,
    private authorizationRequestRepository: AuthorizationRequestRepository,
    private tokenSigner: TokenSigner,
    private passwordHasher: PasswordHasher,
    private generateToken: GenerateToken
  ) {}

  async execute(props: Properties) {
    const { authorizationHeader, signInRequestId } = props;

    if (!authorizationHeader) {
      return notOk(new Error("Authorization missing"));
    }

    const authorizationHeaderData = authorizationHeader.toString().split(" ");

    let userId: User["id"], accessToken: string | undefined;

    if (authorizationHeaderData[0] === "Basic") {
      const userCredentialsBase64 = authorizationHeaderData[1];
      const userCredentialsString = Buffer.from(
        userCredentialsBase64,
        "base64"
      ).toString("utf-8");
      const [username, password] = userCredentialsString.split(":");

      const userResult = await this.userRepository.getOne({ username });

      if (userResult.isNotOk()) {
        return notOk(new Error("Invalid user credentials"));
      }

      const passwordsMatch = this.passwordHasher
        .compare(password, userResult.value.password)
        .mapNotOk(() => false).value;

      if (!passwordsMatch) {
        return notOk(new Error("Invalid user credentials"));
      }

      const accessTokenResult = await this.generateToken.execute({
        accessTokenData: {
          issuer: "internal",
          scope: ["internal:auth"],
          subject: userResult.value.id,
        },
      });

      if (accessTokenResult.isNotOk()) {
        return notOk(
          new Error("Authentication failed", { cause: accessTokenResult.value })
        );
      }

      userId = userResult.value.id;
      accessToken = accessTokenResult.value;
    } else if (authorizationHeaderData[0] === "Bearer") {
      const accessToken = authorizationHeaderData[1];
      const accessTokenDataResult = this.tokenSigner.verify(accessToken);

      if (
        accessTokenDataResult.isNotOk() ||
        accessTokenDataResult.value.subject === undefined
      ) {
        return notOk(new Error("Invalid access token"));
      }

      userId = accessTokenDataResult.value.subject;
    } else {
      return notOk(new Error("Invalid authorization"));
    }

    const authorizationRequestResult =
      await this.authorizationRequestRepository.getOne({
        id: signInRequestId,
      });

    if (authorizationRequestResult.isNotOk()) {
      return notOk(new Error("Invalid request"));
    }

    const authorizationRequestUpdateResult =
      await this.authorizationRequestRepository.updateOne(
        { id: signInRequestId },
        { authorizerUserId: userId }
      );

    if (authorizationRequestUpdateResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    return ok({ accessToken });
  }
}
