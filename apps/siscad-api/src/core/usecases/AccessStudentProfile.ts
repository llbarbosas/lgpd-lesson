import {
  UseCase,
  Result,
  ok,
  StudentProfile,
  User,
  notOk,
  UserRepository,
  CryptoFunctions,
  PasswordHasher,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository } from "@core/data";

type Properties = {
  studentProfileId: StudentProfile["id"];
  userId: User["id"];
  password: string;
};

type PlainStudentProfileData = Partial<
  Pick<StudentProfile, "maritalStatus" | "skinColor">
>;

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
      return notOk(
        new Error("Não foi possível encontrar o cadastro solicitado", {
          cause: studentProfileResult.value,
        })
      );
    }

    const userResult = await this.userRepository.getOne({
      id: props.userId,
    });

    if (userResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível encontrar o usuário solicitado", {
          cause: userResult.value,
        })
      );
    }

    const isValidPassword = this.passwordHasher
      .compare(props.password, userResult.value.password)
      .mapNotOk(() => false).value;

    if (!isValidPassword) {
      return notOk(new Error("Credenciais de usuário inválidas"));
    }

    const passwordHashResult = this.cryptoFunctions.createSha256Hash(
      props.password
    );

    if (passwordHashResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível processar a criptografia da senha", {
          cause: passwordHashResult.value,
        })
      );
    }

    const privateKeyResult = this.cryptoFunctions.decryptSymmetric(
      userResult.value.privateKey,
      passwordHashResult.value
    );

    if (privateKeyResult.isNotOk()) {
      return notOk(
        new Error("Credenciais de usuário inválidas", {
          cause: privateKeyResult.value,
        })
      );
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
        return notOk(
          new Error("O cadastro não foi compartilhado com este usuário")
        );
      }

      if (profileAccessRequest.value.symmetricKey === null) {
        return notOk(
          new Error(
            "A solicitação de acesso ao cadastro ainda não foi autorizada"
          )
        );
      }

      encryptedSymmetricKey = profileAccessRequest.value.symmetricKey;
    }

    const symmetricKeyResult = this.cryptoFunctions.decryptAsymmetric(
      encryptedSymmetricKey,
      privateKeyResult.value
    );

    if (symmetricKeyResult.isNotOk()) {
      return notOk(
        new Error("Credenciais de usuário inválidas", {
          cause: symmetricKeyResult.value,
        })
      );
    }

    const {
      value: { id, userId, symmetricKey, ...encryptedStudentProfileData },
    } = studentProfileResult;

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
