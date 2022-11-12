import {
  UseCase,
  Result,
  ok,
  StudentProfileAccess,
  notOk,
  UserRepository,
  Mailer,
  User,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository } from "@core/data";

type Properties = {
  studentProfileUsername: User["username"];
  userId: User["id"];
  usageIntention: StudentProfileAccess["usageIntention"];
};

export class RequestStudentProfileAccess
  implements UseCase<Properties, Promise<Result<StudentProfileAccess>>>
{
  constructor(
    private studentProfileRespository: StudentProfileRepository,
    private userRepository: UserRepository,
    private mailer: Mailer,
    private apiUrl: string
  ) {}

  async execute({
    studentProfileUsername,
    userId,
    usageIntention,
  }: Properties) {
    const studentProfileUserResult = await this.userRepository.getOne({
      username: studentProfileUsername,
    });

    if (studentProfileUserResult.isNotOk()) {
      return notOk(
        new Error(
          `Não foi possível encontrar o usuário "${studentProfileUsername}"`,
          { cause: studentProfileUserResult.value }
        )
      );
    }

    const studentProfileResult = await this.studentProfileRespository.getOne({
      userId: studentProfileUserResult.value.id,
    });

    if (studentProfileResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível encontrar o cadastro informado", {
          cause: studentProfileResult.value,
        })
      );
    }

    const createStudentProfileAccessRequestResult =
      await this.studentProfileRespository.createOneStudentProfileAccess({
        studentProfileId: studentProfileResult.value.id,
        userId,
        usageIntention,
      });

    if (createStudentProfileAccessRequestResult.isNotOk()) {
      return notOk(
        new Error("Não foi possível registrar a solicitação de acesso", {
          cause: createStudentProfileAccessRequestResult.value,
        })
      );
    }

    const studentUserResult = await this.userRepository.getOne({
      id: studentProfileResult.value.userId,
    });

    if (studentUserResult.isNotOk()) {
      return notOk(
        new Error("Há um problema com o cadastro do usuário solicitado", {
          cause: studentUserResult.value,
        })
      );
    }

    const requestingAuthorizationUserResult = await this.userRepository.getOne({
      id: userId,
    });

    if (requestingAuthorizationUserResult.isNotOk()) {
      return notOk(
        new Error(
          "Não foi possível encontrar o usuário que está solicitando este acesso",
          {
            cause: studentUserResult.value,
          }
        )
      );
    }

    const authorizeAccessEmailResult = await this.mailer.sendMail({
      to: studentUserResult.value.email,
      subject: "Autorização de Acesso ao seu Cadastro Universitário",
      body: `${requestingAuthorizationUserResult.value.fullname} deseja acessar seu cadastro universitário para "${usageIntention}". Para autorizar o acesso, clique neste link: ${this.apiUrl}/profiles/${studentProfileResult.value.id}/authorize?user_id=${userId}`,
    });

    if (authorizeAccessEmailResult.isNotOk()) {
      return notOk(
        new Error(
          "Não foi possível enviar a solicitação de acesso ao e-mail do usuário",
          {
            cause: authorizeAccessEmailResult.value,
          }
        )
      );
    }

    return ok(createStudentProfileAccessRequestResult.value);
  }
}
