import {
  UseCase,
  Result,
  ok,
  StudentProfile,
  notOk,
  User,
  UserRepository,
  CryptoFunctions,
  PasswordHasher,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository } from "@core/data";

type Properties = {
  studentProfile: Omit<StudentProfile, "id" | "userId" | "symmetricKey">;
  userId: User["id"];
  password: string;
};

export class SubmitStudentProfile
  implements UseCase<Properties, Promise<Result<Pick<StudentProfile, "id">>>>
{
  constructor(
    private studentProfileRepository: StudentProfileRepository,
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
    private cryptoFunctions: CryptoFunctions
  ) {}

  async execute(props: Properties) {
    const userResult = await this.userRepository.getOne({
      id: props.userId,
    });

    if (userResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível encontrar o usuário informado", {
          cause: userResult.value,
        })
      );
    }

    const isValidPassword = this.passwordHasher
      .compare(props.password, userResult.value.password)
      .mapNotOk(() => false);

    if (!isValidPassword) {
      return notOk(new Error("Credenciais de usuário inválidas"));
    }

    const symmetricKeyResult =
      this.cryptoFunctions.generateRandomSymmetricKey();

    if (symmetricKeyResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível processar a criptografia dos dados", {
          cause: symmetricKeyResult.value,
        })
      );
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
      return notOk(
        new Error("Não foi possível processar a criptografia dos dados", {
          cause: encryptedSymmetricKeyResult.value,
        })
      );
    }

    const createStudentProfileResult =
      await this.studentProfileRepository.createOne({
        ...encryptedStudentProfileData,
        userId: props.userId,
        symmetricKey: encryptedSymmetricKeyResult.value,
      });

    if (createStudentProfileResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível registrar o cadastro", {
          cause: createStudentProfileResult.value,
        })
      );
    }

    return ok({ id: createStudentProfileResult.value.id });
  }
}
