import {
  UseCase,
  Result,
  ok,
  StudentProfile,
  User,
  notOk,
  StudentProfileAccess,
  UserRepository,
  CryptoFunctions,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository } from "@core/data";

type Properties = {
  studentProfileId: StudentProfile["id"];
  userId: User["id"];
  password: string;
};

export class AuthorizeStudentProfileAccess
  implements
    UseCase<
      Properties,
      Promise<Result<Omit<StudentProfileAccess, "symmetricKey">>>
    >
{
  constructor(
    private studentProfileRepository: StudentProfileRepository,
    private userRepository: UserRepository,
    private cryptoFunctions: CryptoFunctions
  ) {}

  async execute(props: Properties) {
    const studentProfileResult = await this.studentProfileRepository.getOne({
      id: props.studentProfileId,
    });

    if (studentProfileResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível encontrar o cadastro informado", {
          cause: studentProfileResult.value,
        })
      );
    }

    const sharedWithUserResult = await this.userRepository.getOne({
      id: props.userId,
    });

    if (sharedWithUserResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível encontrar o usuário informado", {
          cause: sharedWithUserResult.value,
        })
      );
    }

    const ownerUserResult = await this.userRepository.getOne({
      id: studentProfileResult.value.userId,
    });

    if (ownerUserResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível encontrar o usuário informado", {
          cause: sharedWithUserResult.value,
        })
      );
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

    const userPlainPrivateKeyResult = this.cryptoFunctions.decryptSymmetric(
      ownerUserResult.value.privateKey,
      passwordHashResult.value
    );

    if (userPlainPrivateKeyResult.isNotOk()) {
      return notOk(
        new Error("Credenciais de usuário inválidas", {
          cause: userPlainPrivateKeyResult.value,
        })
      );
    }

    const {
      value: { symmetricKey: encryptedSymmetricKey },
    } = studentProfileResult;

    const symmetricKeyResult = this.cryptoFunctions.decryptAsymmetric(
      encryptedSymmetricKey,
      userPlainPrivateKeyResult.value
    );

    if (symmetricKeyResult.isNotOk()) {
      return notOk(
        new Error("Credenciais de usuário inválidas", {
          cause: symmetricKeyResult.value,
        })
      );
    }

    const {
      value: { publicKey: sharedWithUserPublicKey, id: sharedWithUserId },
    } = sharedWithUserResult;

    const sharedWithUserSymmetricKeyResult =
      this.cryptoFunctions.encryptAsymmetric(
        symmetricKeyResult.value,
        sharedWithUserPublicKey
      );

    if (sharedWithUserSymmetricKeyResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível processar a criptografia dos cadastro", {
          cause: sharedWithUserSymmetricKeyResult.value,
        })
      );
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
      return notOk(
        new Error(
          "Não foi possível atualizar a solicitação de acesso ao cadastro",
          {
            cause: updateStudentProfileAccessResult.value,
          }
        )
      );
    }

    const { symmetricKey: _, ...updateStudentProfileAccess } =
      updateStudentProfileAccessResult.value;

    return ok(updateStudentProfileAccess);
  }
}
