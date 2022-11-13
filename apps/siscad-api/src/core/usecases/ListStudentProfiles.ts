import { StudentProfileRepository } from "@core/data";
import {
  UseCase,
  Result,
  ok,
  UserRepository,
  TokenSigner,
  AccessTokenData,
  notOk,
  StudentProfile,
  StudentProfileAccess,
  User,
} from "@lgpd-lesson/shared";

type Properties = {
  accessTokenData: AccessTokenData;
};

type ProfileInfo = {
  id: StudentProfile["id"];
};

type ProfileShareInfo = {
  studentProfileId: StudentProfileAccess["studentProfileId"];
  senderId: StudentProfileAccess["userId"];
  senderUsername: User["username"];
  receiverId: StudentProfileAccess["userId"];
  receiverUsername: User["username"];
  status: "authorized" | "requested";
};

export class ListStudentProfiles
  implements
    UseCase<
      Properties,
      Promise<
        Result<{
          profile?: ProfileInfo;
          profileSharesSent: ProfileShareInfo[];
          profileSharesReceived: ProfileShareInfo[];
        }>
      >
    >
{
  constructor(
    private studentProfileRepository: StudentProfileRepository,
    private userRepository: UserRepository
  ) {}

  async execute(props: Properties) {
    const { subject, scope } = props.accessTokenData;

    if (!scope.includes("student.profile:share")) {
      return notOk(new Error("Permissão negada (student.profile:share)"));
    }

    const profileResult = await this.studentProfileRepository.getOne({
      userId: subject,
    });

    const profile = await profileResult
      .mapOk(async ({ id }) => ({
        id,
      }))
      .mapNotOk(() => undefined).value;

    const profileSharesSent = await this.getProfileSharesInfo({
      studentProfileId: profile?.id,
    });

    const profileSharesReceived = await this.getProfileSharesInfo({
      userId: subject,
    });

    return ok({
      profile,
      profileSharesSent,
      profileSharesReceived,
    });
  }

  private async getUsernameOrUndefined(
    userId: User["id"]
  ): Promise<User["username"] | undefined> {
    const userResult = await this.userRepository.getOne({ id: userId });

    return userResult
      .mapNotOk(() => undefined)
      .mapOk(({ username }) => username).value;
  }

  private async getProfileOwnerInfoOrUndefined(
    studentProfileId: StudentProfile["id"]
  ): Promise<Pick<User, "id" | "username"> | undefined> {
    const studentProfileResult = await this.studentProfileRepository.getOne({
      id: studentProfileId,
    });

    if (studentProfileResult.isNotOk()) {
      return;
    }

    const userResult = await this.userRepository.getOne({
      id: studentProfileResult.value.userId,
    });

    return userResult
      .mapNotOk(() => undefined)
      .mapOk(({ id, username }) => ({ id, username })).value;
  }

  private async getProfileSharesInfo(query: {
    userId?: User["id"];
    studentProfileId?: StudentProfile["id"];
  }): Promise<ProfileShareInfo[]> {
    const profileSharesResult =
      await this.studentProfileRepository.getAllProfileAccess(query);

    if (profileSharesResult.isNotOk()) {
      return [];
    }

    const profileSharesPromises: Promise<ProfileShareInfo>[] =
      profileSharesResult.value.map(
        async ({ studentProfileId, userId, symmetricKey }) => {
          const senderInfoResult = await this.getProfileOwnerInfoOrUndefined(
            studentProfileId
          );
          const receiverUsername = await this.getUsernameOrUndefined(userId);
          const status: ProfileShareInfo["status"] =
            symmetricKey !== undefined ? "authorized" : "requested";

          return {
            studentProfileId,
            senderId: senderInfoResult?.id as User["id"],
            senderUsername: senderInfoResult?.username as User["username"],
            receiverId: userId,
            receiverUsername: receiverUsername as User["username"],
            status,
          };
        }
      );

    return Promise.all(profileSharesPromises);
  }
}
