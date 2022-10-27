import {
  UseCase,
  Result,
  ok,
  StudentProfile,
  User,
  notOk,
  StudentProfileAccess,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository, UserRepository } from "@core/data";
import { CryptoFunctions, PasswordHasher } from "@core/provider";

type Properties = {
  studentProfileId: StudentProfile["id"];
  username: User["id"];
  password: string;
};

export class AuthorizeStudentProfileAccess
  implements UseCase<Properties, Promise<Result<StudentProfileAccess>>>
{
  constructor(
    private studentProfileRepository: StudentProfileRepository,
    private userRepository: UserRepository,
    private cryptoFunctions: CryptoFunctions,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(props: Properties) {
    const studentProfileResult = await this.studentProfileRepository.getOne({
      id: props.studentProfileId,
    });

    if (studentProfileResult.isNotOk()) {
      return notOk(new Error("Student profile not found"));
    }

    const userResult = await this.userRepository.getOne({
      username: props.username,
    });

    if (userResult.isNotOk()) {
      return notOk(new Error("User not found"));
    }

    const passwordHashResult = this.cryptoFunctions.createSha256Hash(
      props.password
    );

    if (passwordHashResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const {
      value: { symmetricKey: encryptedSymmetricKey },
    } = studentProfileResult;

    const symmetricKeyResult = this.cryptoFunctions.decryptAsymmetric(
      encryptedSymmetricKey,
      passwordHashResult.value
    );

    if (symmetricKeyResult.isNotOk()) {
      return notOk(new Error("Invalid password"));
    }

    const {
      value: { publicKey: sharedWithUserPublicKey, id: sharedWithUserId },
    } = userResult;

    const sharedWithUserSymmetricKeyResult =
      this.cryptoFunctions.encryptAsymmetric(
        symmetricKeyResult.value,
        sharedWithUserPublicKey
      );

    if (sharedWithUserSymmetricKeyResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const updateStudentProfileAccessResult =
      await this.studentProfileRepository.updateOneStudentProfileAccess(
        {
          studentProfileId: props.studentProfileId,
          userId: sharedWithUserId,
        },
        {
          symmetricKey: sharedWithUserSymmetricKeyResult.value,
        }
      );

    if (updateStudentProfileAccessResult.isNotOk()) {
      return notOk(new Error("Cannot create profile access"));
    }

    return ok(updateStudentProfileAccessResult.value);
  }
}
