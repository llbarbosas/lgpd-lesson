import {
  UseCase,
  Result,
  ok,
  StudentProfileAccess,
  notOk,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository, UserRepository } from "@core/data";
import { Mailer } from "@core/provider";

type Properties = {
  studentProfileId: StudentProfileAccess["studentProfileId"];
  userId: StudentProfileAccess["userId"];
  usageIntention: StudentProfileAccess["usageIntention"];
};

export class RequestStudentProfileAccess
  implements UseCase<Properties, Promise<Result<StudentProfileAccess>>>
{
  constructor(
    private studentProfileRespository: StudentProfileRepository,
    private userRepository: UserRepository,
    private mailer: Mailer
  ) {}

  async execute({ studentProfileId, userId, usageIntention }: Properties) {
    const studentProfileResult = await this.studentProfileRespository.getOne({
      id: studentProfileId,
    });

    if (studentProfileResult.isNotOk()) {
      return notOk(new Error("Student profile not found"));
    }

    const createStudentProfileAccessRequestResult =
      await this.studentProfileRespository.createOneStudentProfileAccess({
        studentProfileId,
        userId,
        usageIntention,
      });

    if (createStudentProfileAccessRequestResult.isNotOk()) {
      return notOk(new Error("Cannot create student profile access request"));
    }

    const studentUserResult = await this.userRepository.getOne({
      id: studentProfileResult.value.userId,
    });

    if (studentUserResult.isNotOk()) {
      return notOk(new Error("Student profile user not found"));
    }

    const authorizeAccessEmailResult = await this.mailer.sendMail({
      to: studentUserResult.value.email,
      subject: "Profile Access Authorization",
      body: `User ${userId} desires to access your data for ${usageIntention}. Authorize his access on https://${studentProfileId}/${userId}`,
    });

    if (authorizeAccessEmailResult.isNotOk()) {
      return notOk(
        new Error("Cannot send authorization email to student email")
      );
    }

    return ok(createStudentProfileAccessRequestResult.value);
  }
}
