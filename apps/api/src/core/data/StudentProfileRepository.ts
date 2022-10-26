import {
  Result,
  StudentProfile,
  StudentProfileAccess,
  User,
} from "@lgpd-lesson/shared";

export interface StudentProfileRepository {
  getOne(query: { id: StudentProfile["id"] }): Promise<Result<StudentProfile>>;
  createOne(data: Omit<StudentProfile, "id">): Promise<Result<StudentProfile>>;

  getOneProfileAccess(query: {
    studentProfileId: StudentProfile["id"];
    userId: User["id"];
  }): Promise<Result<StudentProfileAccess>>;
  createOneStudentProfileAccess(
    data: Pick<
      StudentProfileAccess,
      "studentProfileId" | "userId" | "usageIntention"
    >
  ): Promise<Result<StudentProfileAccess>>;
  updateOneStudentProfileAccess(
    query: Pick<StudentProfileAccess, "studentProfileId" | "userId">,
    data: Pick<StudentProfileAccess, "symmetricKey">
  ): Promise<Result<StudentProfileAccess>>;
}
