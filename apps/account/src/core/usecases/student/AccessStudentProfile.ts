import {
  Injectable,
  UseCase,
  Result,
  ok,
  StudentProfile,
  User,
  notOk,
} from "@lgpd-lesson/shared";
import {
  StudentProfileRepository,
  UserRepository,
  CryptoFunctions,
  PasswordHasher,
} from "src/core";

type Properties = {
  studentProfileId: StudentProfile["id"];
  username: User["id"];
  password: string;
};

type PlainStudentProfileData = Partial<
  Pick<StudentProfile, "maritalStatus" | "skinColor">
>;

@Injectable()
export class AccessStudentProfile
  implements UseCase<Properties, Promise<Result<PlainStudentProfileData>>>
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
      return notOk(new Error("Invalid student profile ID"));
    }

    const userResult = await this.userRepository.getOne({
      username: props.username,
    });

    if (userResult.isNotOk()) {
      return notOk(new Error("Invalid username"));
    }

    const isValidPassword = this.passwordHasher
      .compare(props.password, userResult.value.password)
      .mapNotOk(() => false);

    if (!isValidPassword) {
      return notOk(new Error("Invalid password"));
    }

    const passwordHashResult = this.cryptoFunctions.createSha256Hash(
      props.password
    );

    if (passwordHashResult.isNotOk()) {
      return notOk(new Error("Server error"));
    }

    const privateKeyResult = this.cryptoFunctions.decryptSymmetric(
      userResult.value.privateKey,
      passwordHashResult.value
    );

    if (privateKeyResult.isNotOk()) {
      return notOk(new Error("Invalid password"));
    }

    let encryptedSymmetricKey: string;

    const isOwnProfileAccess =
      studentProfileResult.value.userId === userResult.value.id;

    if (isOwnProfileAccess) {
      encryptedSymmetricKey = studentProfileResult.value.symmetricKey;
    } else {
      const profileAccessRequest =
        await this.studentProfileRepository.getOneProfileAccess({
          studentProfileId: studentProfileResult.value.id,
          userId: userResult.value.id,
        });

      if (profileAccessRequest.isNotOk()) {
        return notOk(new Error("Profile not accesssible to user"));
      }

      if (profileAccessRequest.value.symmetricKey === null) {
        return notOk(
          new Error("Student profile access request not awnsered yet")
        );
      }

      encryptedSymmetricKey = profileAccessRequest.value.symmetricKey;
    }

    const symmetricKeyResult = this.cryptoFunctions.decryptAsymmetric(
      encryptedSymmetricKey,
      privateKeyResult.value
    );

    if (symmetricKeyResult.isNotOk()) {
      return notOk(new Error("Invalid password"));
    }

    const {
      value: { maritalStatus, skinColor },
    } = studentProfileResult;

    const encryptedStudentProfileData = { maritalStatus, skinColor };

    const decryptedStudentProfileData = Object.entries(
      encryptedStudentProfileData
    ).reduce(
      (data, [key, value]) => ({
        ...data,
        [key]: this.cryptoFunctions
          .decryptSymmetric(value, symmetricKeyResult.value)
          .mapNotOk(() => undefined).value,
      }),
      {} as PlainStudentProfileData
    );

    return ok(decryptedStudentProfileData);
  }
}
