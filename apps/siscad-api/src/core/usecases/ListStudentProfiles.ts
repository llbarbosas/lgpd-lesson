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
} from "@lgpd-lesson/shared";

type Properties = {
  accessTokenData: AccessTokenData;
};

export class ListStudentProfiles
  implements
    UseCase<
      Properties,
      Promise<
        Result<{
          profile?: Pick<StudentProfile, "id" | "userId">;
          profilesShared: Array<
            Pick<StudentProfileAccess, "studentProfileId" | "userId"> & {
              shared: boolean;
            }
          >;
          profileSharedWith: Array<
            Pick<StudentProfileAccess, "studentProfileId" | "userId"> & {
              shared: boolean;
            }
          >;
        }>
      >
    >
{
  constructor(private studentProfileRepository: StudentProfileRepository) {}

  async execute(props: Properties) {
    const { subject, scope } = props.accessTokenData;

    if (!scope.includes("student.profile:share")) {
      return notOk(new Error("Permissão negada (student.profile:share)"));
    }

    const profileResult = await this.studentProfileRepository.getOne({
      userId: subject,
    });

    const profile = profileResult
      .mapOk(({ id, userId }) => ({ id, userId }))
      .mapNotOk(() => undefined).value;

    const profileSharedWithResult =
      await this.studentProfileRepository.getAllProfileAccess({
        studentProfileId: profile?.id,
      });

    const profileSharedWith = profileSharedWithResult
      .mapOk((profileAccesses) =>
        profileAccesses.map(({ studentProfileId, userId, symmetricKey }) => ({
          studentProfileId,
          userId,
          shared: symmetricKey !== undefined,
        }))
      )
      .mapNotOk(() => [] as any[]).value;

    const profilesSharedResult =
      await this.studentProfileRepository.getAllProfileAccess({
        userId: subject,
      });

    const profilesShared = profilesSharedResult
      .mapOk((profileAccesses) =>
        profileAccesses.map(({ studentProfileId, userId, symmetricKey }) => ({
          studentProfileId,
          userId,
          shared: symmetricKey !== undefined,
        }))
      )
      .mapNotOk(() => [] as any[]).value;

    return ok({
      profile,
      profileSharedWith,
      profilesShared,
    });
  }
}
