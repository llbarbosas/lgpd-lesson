import {
  UseCase,
  Result,
  ok,
  StudentProfile,
  notOk,
  User,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository, UserRepository } from "@core/data";
import { CryptoFunctions, PasswordHasher } from "@core/provider";

type Properties = {
  studentProfile: Pick<StudentProfile, "maritalStatus" | "skinColor">;
  username: User["username"];
  password: string;
};

export class SubmitStudentProfile
  implements UseCase<Properties, Promise<Result<StudentProfile>>>
{
  constructor(
    private studentProfileRepository: StudentProfileRepository,
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private cryptoFunctions: CryptoFunctions
  ) {}

  async execute(props: Properties) {
    const userResult = await this.userRepository.getOne({
      username: props.username,
    });

    if (userResult.isNotOk()) {
      return notOk(new Error("User not found"));
    }

    const isValidPassword = this.passwordHasher
      .compare(props.password, userResult.value.password)
      .mapNotOk(() => false);

    if (!isValidPassword) {
      return notOk(new Error("Invalid password"));
    }

    const symmetricKeyResult =
      this.cryptoFunctions.generateRandomSymmetricKey();

    if (symmetricKeyResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const plainStudentProfileData = props.studentProfile;

    const encryptedStudentProfileData = Object.entries(
      plainStudentProfileData
    ).reduce(
      (data, [key, value]) => ({
        ...data,
        [key]: this.cryptoFunctions
          .encryptSymmetric(value, symmetricKeyResult.value)
          .mapNotOk(() => undefined).value,
      }),
      {} as StudentProfile
    );

    const encryptedSymmetricKeyResult = this.cryptoFunctions.encryptAsymmetric(
      symmetricKeyResult.value,
      userResult.value.publicKey
    );

    if (encryptedSymmetricKeyResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const createStudentProfileResult =
      await this.studentProfileRepository.createOne({
        ...encryptedStudentProfileData,
        symmetricKey: encryptedSymmetricKeyResult.value,
      });

    if (createStudentProfileResult.isNotOk()) {
      return notOk(new Error("Cannot create student profile"));
    }

    return ok(createStudentProfileResult.value);
  }
}
