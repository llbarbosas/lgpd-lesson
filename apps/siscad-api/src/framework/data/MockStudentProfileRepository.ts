import {
  notOk,
  ok,
  Result,
  StudentProfile,
  StudentProfileAccess,
} from "@lgpd-lesson/shared";
import { StudentProfileRepository } from "@core";
import { randomUUID } from "crypto";

export class MockStudentProfileRepository implements StudentProfileRepository {
  constructor(
    private repositoryData: {
      profile: Record<StudentProfile["id"], StudentProfile>;

      // key: `${studentProfileId}:${userId}`
      profileAccess: Record<string, StudentProfileAccess>;
    } = { profile: {}, profileAccess: {} }
  ) {}

  async getOne(query: {
    id?: string;
    userId?: string;
  }): Promise<Result<StudentProfile, Error>> {
    let studentProfile: StudentProfile | undefined;

    if (query.id) {
      studentProfile = this.repositoryData.profile[query.id];
    } else if (query.userId) {
      studentProfile = Object.values(this.repositoryData.profile).find(
        ({ userId }) => userId === query.userId
      );
    }

    if (studentProfile === undefined) {
      return notOk(new Error("Student profile not found"));
    }

    return ok(studentProfile);
  }

  async createOne(
    data: Omit<StudentProfile, "id">
  ): Promise<Result<StudentProfile, Error>> {
    const id = randomUUID();
    const studentProfile = { ...data, id };

    this.repositoryData.profile[id] = studentProfile;

    return ok(studentProfile);
  }

  private makeStudentProfileAccessId({
    studentProfileId,
    userId,
  }: {
    studentProfileId: string;
    userId: string;
  }) {
    return `${studentProfileId}:${userId}`;
  }

  async getAllProfileAccess(
    query?: { userId?: string | undefined } | undefined
  ): Promise<Result<StudentProfileAccess[], Error>> {
    return ok(
      Object.values(this.repositoryData.profileAccess).filter(({ userId }) => {
        return query?.userId ?? userId === query?.userId;
      })
    );
  }

  async getOneProfileAccess(query: {
    studentProfileId: string;
    userId: string;
  }): Promise<Result<StudentProfileAccess, Error>> {
    const id = this.makeStudentProfileAccessId(query);
    const studentProfileAccess = this.repositoryData.profileAccess[id];

    if (studentProfileAccess === undefined) {
      return notOk(new Error("Student profile access not found"));
    }

    return ok(studentProfileAccess);
  }

  async createOneStudentProfileAccess(
    data: Pick<
      StudentProfileAccess,
      "userId" | "studentProfileId" | "usageIntention" | "symmetricKey"
    >
  ): Promise<Result<StudentProfileAccess, Error>> {
    const id = this.makeStudentProfileAccessId(data);

    this.repositoryData.profileAccess[id] = data;

    return ok(data);
  }

  async updateOneStudentProfileAccess(
    query: Pick<StudentProfileAccess, "userId" | "studentProfileId">,
    data: Pick<StudentProfileAccess, "symmetricKey">
  ): Promise<Result<StudentProfileAccess, Error>> {
    const id = this.makeStudentProfileAccessId(query);

    const studentProfileAccess = this.repositoryData.profileAccess[id];

    if (studentProfileAccess === undefined) {
      return notOk(new Error("Student profile access not found"));
    }

    const updatedStudentProfileAccess = { ...studentProfileAccess, ...data };

    this.repositoryData.profileAccess[id] = updatedStudentProfileAccess;

    return ok(updatedStudentProfileAccess);
  }
}
